#!/usr/bin/env node

const resolve = require('path').resolve
require('app-module-path').addPath(__dirname + '/../../');

require('dotenv').config({ path: resolve('../..', '.env'), silent: true })

const { config } = require('app-modules/constants/course-config')
const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise
const async = require('async')

const quizTypes = require('app-modules/constants/quiz-types')
const { validateAnswer, validateProgress } = require('app-modules/quiz-validation')

const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')
const PeerReview = require('app-modules/models/peer-review')
const CourseState = require('app-modules/models/course-state')

const { fetchQuizIds } = require('./utils/quiznator-tools')
const { median, calculatePercentage, printProgress } = require('./utils/mathutils')
const { precise_round } = require('app-modules/utils/math-utils')
const sleep = require("sleep")

sleep.sleep(5)


mongoose.connect(config.DB_URI, {
  useMongoClient: true
})

var db = mongoose.connection

db.on('error', err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
})

let tags = []

_.map(_.range(1, config.PARTS + 1), (part) => {
  _.map(_.range(1, config.SECTIONS_PER_PART + 1), (section) => {
    tags.push(`${config.COURSE_SHORT_ID}_${part}_${section}`)
  })
})

/*
  - course completion status
  - peer reviews pending? not updated here
  - 
*/
function getProgressWithValidation(data) {
  const { answererId, answers, quizzes } = data

  const quizIds = quizzes.map(quiz => quiz._id)

  let essaysAwaitingPeerReviewsGiven = []
  let latestAnswerDate = 0

  const answerQuizIds = Array.from(answers.keys()) // map(answer => answer.quizId.toString());

  const progress = _.groupBy(quizzes.map(quiz => {
    let answersForQuiz = answers.get(quiz._id.toString()) || []
    let answer = answersForQuiz //answers[quiz._id] || []

    if (answersForQuiz.length > 0) {
      let newestDate = 0
  
      newestDate = answer[0].createdAt

      // answers now come sorted by date from backend

/*       answersForQuiz.forEach(answerForQuiz => {
        if (answerForQuiz.updatedAt > newestDate) {
          answer = [answerForQuiz] // expecting [0]...
          newestDate = answerForQuiz.updatedAt
        } 
      }) */
      latestAnswerDate = Math.max(newestDate, latestAnswerDate)
    }

    let returnObject = {
      quiz,
      answer: answers && answer.length > 0 ? answer : [],
    } 

    return returnObject
  }), entry => {
    return ~answerQuizIds.indexOf(entry.quiz._id.toString()) ? 'answered' : 'notAnswered'
    // had: _.get(entry, 'answer[0].rejected') ? 'rejected' :
  })

  if (isNaN(latestAnswerDate)) { // hmm
    latestAnswerDate = 0
  }

  let returnObject = {
    answererId,
    essaysAwaitingPeerReviewsGiven,
    latestAnswerDate
  }

  returnObject = Object.assign(
    {}, 
    returnObject, 
    validateProgress(progress))

  return returnObject 
}

function updateCompletion(data) {
  return new Promise((resolve, reject) => {
    const { answererId, scoreObject, completionAnswersDate, partialCompleted } = data

    const completed = 
      scoreObject.progress >= config.MINIMUM_PROGRESS_TO_PASS && 
      scoreObject.score >= config.MINIMUM_SCORE_TO_PASS

    if (partialCompleted !== completed) {
      console.log('Answerer', answererId, 'has differing states for completion')
    }

    CourseState.findOne( // andupdate
      { answererId,
        courseId: config.COURSE_ID
      }
    ).then(courseState => {
      let completionDate

      if (!_.get(courseState, 'completion.completed') && completed) {
        // either new coursestate or hadn't previously completed but has now
        completionDate = Date.now()
      } else {
        completionDate = _.get(courseState, 'completion.completionDate', null)        
      }

      let completionData = {
        data: scoreObject,
        completed,
        completionDate,
        completionAnswersDate,
        confirmationSent: false
      }


      if (!courseState) {
        newCourseState = CourseState({ 
          answererId,
          courseId: config.COURSE_ID,
          completion: completionData
        })
        
        return newCourseState.save()
      }
      
      if (!_.get(courseState, 'completion.confirmationSent')) {
        // don't change data if confirmation already sent
        courseState.completion = completionData

        return courseState.save()
      }

      // let's update the completion answer date at least
      courseState.completion.completionAnswersDate = completionAnswersDate

      return courseState.save()
    })
    .then(state => resolve(state))
    .catch(err => reject(err))
  })
}

const mapAnswers = (answers) => {
  const answersForAnswerer = new Map()

  answers.forEach(answer => {
    if (!answersForAnswerer.has(answer.answererId)) {
      answersForAnswerer.set(answer.answererId, new Map())
    }
    if (!answersForAnswerer.get(answer.answererId).has(answer.quizId.toString())) {
      answersForAnswerer.get(answer.answererId).set(answer.quizId.toString(), [])
    }
    let value = answersForAnswerer.get(answer.answererId).get(answer.quizId.toString())
    value.push(answer)
    answersForAnswerer.get(answer.answererId).set(answer.quizId.toString(), value)
  })

  return answersForAnswerer
}

const mapEntry = (entry) => ({
  quizId: entry.quiz._id,
  answerId: entry.answer[0]._id,
  points: entry.validation.points,
  maxPoints: entry.validation.maxPoints,
  normalizedPoints: entry.validation.normalizedPoints,
  confirmed: entry.answer[0].confirmed,
  rejected: entry.answer[0].rejected,
  peerReviewCount: entry.answer[0].peerReviewCount,
  spamFlags: entry.answer[0].spamFlags,
  type: entry.quiz.type,
  createdAt: entry.answer[0].createdAt,
  updatedAt: entry.answer[0].updatedAt
})

const getCompleted = async () => {
  const quizIds = await fetchQuizIds(tags)

  console.log('initing...')

  const quizIdsMap = quizIds.map(quizId => mongoose.Types.ObjectId(quizId))

  const answers = await QuizAnswer
    .find({ quizId: { $in: quizIdsMap }})
    .sort({ createdAt: -1 })
    .exec() 
/*    const getAnswers = QuizAnswer.aggregate([{ 
    $match: { 
      quizId: { $in: quizIdsMap }, 
//        spamFlags: { $lte: config.MAXIMUM_SPAM_FLAGS_TO_PASS } 
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }, 
  //{ $sample: { size: 10000 } }
  ]).exec()*/

  const quizzes = await Quiz.findAnswerable({ _id: { $in: quizIdsMap }}).exec()
  // ...check for existing confirmations
  
/*   const quizzes = await getQuizzes
  const answers = await getAnswers */

/*   return Promise.all([getQuizzes, getAnswers])
    .spread(async (quizzes, answers) => { */
      const countableQuizIds = quizzes.filter(quiz => !_.includes(quiz.tags, 'ignore')).map(quiz => quiz._id.toString())
      
      const maxCountableNormalizedPoints = countableQuizIds.length
    
      const answererIds = _.uniq(answers.map(answer => answer.answererId))
      //const quizIds = _.uniq(answers.map(answer => answer._doc.quizId.toString()))

      console.log(answererIds.length + ' unique answerers, '+ answers.length + ' answers to trawl through...')

      let answersForAnswerer = mapAnswers(answers)

      console.log('Ready initing, start crunching')    

      let count = 0

      const completed = await Promise.all(answererIds.map(async (answererId) => {
        //console.log(answererId)
        const progress = getProgressWithValidation({
          answererId, 
          answers: answersForAnswerer.get(answererId), 
          quizzes
        })

        //console.log(progress)
        count += 1
        percentage = precise_round(count / answererIds.length * 100, 0)
/*           if (!_.includes(percentagesShown, percentage)) {
          percentagesShown.push(percentage)
          printProgress(percentage)
        } */

        const score = calculatePercentage(progress.validation.normalizedPoints, progress.validation.maxNormalizedPoints)
        const pointsPercentage = calculatePercentage(progress.validation.points, progress.validation.maxPoints)
                

        // go through answers in submission order and determine the date when the answerer
        // could have been potentially have completed  

        const answerValidation = progress.answered.map(entry => mapEntry(entry))
        const sortedAnswers = _.sortBy(answerValidation, 'createdAt')

        let partialNormalizedPoints = 0
        let partialConfirmedAmount = 0
        let partialCompleted = false
        let completionAnswersDate = null

        let prevDate = 0

        sortedAnswers.some((entry => {
          if (prevDate > entry.createdAt) {
            return Promise.reject(new Error('answer sorting is borked?'))
          }

          prevDate = entry.createdAt

          if (_.includes(countableQuizIds, entry.quizId.toString())) {
            partialNormalizedPoints += entry.normalizedPoints
            partialConfirmedAmount += entry.confirmed ? 1 : 0
          }

          let partialProgress = calculatePercentage(partialConfirmedAmount, maxCountableNormalizedPoints)
          let partialScore = calculatePercentage(partialNormalizedPoints, maxCountableNormalizedPoints)

          if (partialProgress > 100 || partialScore > 100) {
            return Promise.reject(new Error('your progress/score calculations are wrong', progress, partialProgress, partialScore))
          }

          if (partialProgress >= config.MINIMUM_PROGRESS_TO_PASS &&
              partialScore >= config.MINIMUM_SCORE_TO_PASS) {
            completionAnswersDate = entry.createdAt
            partialCompleted = true
            
            if (partialProgress > progress.validation.progress || partialScore > score) {
              console.log('%s official p/s %d/%d partial p/s %d/%d', answererId, progress.validation.progress, score, partialProgress, partialScore)
            }

            return true
          }

          return false
        }))

        const scoreObject = {
          answererId,
          answerValidation,
          points: progress.validation.points,
          maxPoints: progress.validation.maxPoints,
          normalizedPoints: progress.validation.normalizedPoints,
          maxNormalizedPoints: progress.validation.maxNormalizedPoints,
          maxCompletedPoints: progress.validation.maxCompletedPoints,
          maxCompletedNormalizedPoints: progress.validation.maxCompletedNormalizedPoints,
          progress: progress.validation.progress,
          score,
          pointsPercentage,
          date: Date.now(),
          latestAnswerDate: progress.latestAnswerDate
        }


          //console.log('completion:', answererId)

        try {
          await updateCompletion({
            answererId,
            scoreObject,
            completionAnswersDate,
            partialCompleted
          })
        } catch (err) {
          throw err
        }

        if (progress.validation.progress >= config.MINIMUM_PROGRESS_TO_PASS && 
          score >= config.MINIMUM_SCORE_TO_PASS) {
          return scoreObject
        }

        return
      }))
      .then(results => results.filter(v => !!v))
      .catch(err => Promise.reject(err))

      return completed
/*     })
    .then(completed => Promise.resolve(completed))
    .catch(err => Promise.reject(err)) */
}

setTimeout(() => {
  getCompleted()
    .then(response => {
    /*   console.log('\n', JSON.stringify(response)) */
      console.log(response.length + ' completed')
      // process.exit(0)
    })
    .catch(err => {
      console.error('error', err)
      process.exit(1)
    })
}, 2000)


setInterval(() => {}, 1000)


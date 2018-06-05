#!/usr/bin/env node
const resolve = require('path').resolve
require('app-module-path').addPath(__dirname + '/../../');

require('dotenv').config({ silent: true });

const { config } = require('./constants/config')
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

mongoose.connect(config.DB_URI, err => {
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
function getProgressWithValidation(answererId, answers, quizzes) {
  //return new Promise((resolve, reject) => {
  //const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})
  const quizIds = quizzes.map(quiz => quiz._id)
  //const getAnswers = QuizAnswer.find({ answererId, quizId: { $in: quizIds } }).exec()
  //const getPeerReviewsGiven = PeerReview.find({ sourceQuizId: { $in: quizIds }, giverAnswererId: answererId }).exec() 
  //const getPeerReviewsReceived = PeerReview.find({ sourceQuizId: { $in: quizIds }, targetAnswererId: answererId }).exec() 

  let essaysAwaitingPeerReviewsGiven = []
  let latestAnswerDate = 0

  /*     return getAnswers
      .then(answers => { */
  //return Promise.all([getAnswers/*, getPeerReviewsGiven, getPeerReviewsReceived*/])
  //  .spread((answers/*, peerReviewsGiven, peerReviewsReceived*/) => {

  const answerQuizIds = Array.from(answers.keys()) // map(answer => answer.quizId.toString());

  const progress = _.groupBy(quizzes.map(quiz => {
    /*           const answersForQuiz = answers.filter(answer => answer.quizId.equals(quiz._id))

          let answer = answersForQuiz
                    */
    let answersForQuiz = answers.get(quiz._id.toString()) || []
    let answer = answersForQuiz //answers[quiz._id] || []

    //console.log(answers)

    if (answersForQuiz.length > 0) {
      let newestDate = 0
      
      answersForQuiz.forEach(answerForQuiz => {
        if (answerForQuiz.updatedAt > newestDate) {
          answer = [answerForQuiz] // expecting [0]...
          newestDate = answerForQuiz.updatedAt
        } 
      })
      latestAnswerDate = Math.max(newestDate, latestAnswerDate)
    }

    let peerReviewsReturned = undefined
          
    /*          if (quiz.type === quizTypes.ESSAY) {
            const given = peerReviewsGiven.filter(pr => pr.sourceQuizId.equals(quiz._id))
            const received = peerReviewsReceived.filter(pr => pr.sourceQuizId.equals(quiz._id))
            
            peerReviewsReturned = {
              given,
              received
            }

            if (given.length < MINIMUM_PEER_REVIEWS_GIVEN && answer.length > 0)  {
              essaysAwaitingPeerReviewsGiven.push(quiz._id)
            }
          }*/

    let returnedQuiz

    returnedQuiz = quiz

    let returnObject = {
      quiz: returnedQuiz,
      answer: answers && answer.length > 0 ? answer : [],
      peerReviews: peerReviewsReturned
    } 

    return returnObject
  }), entry => answerQuizIds.indexOf(entry.quiz._id.toString()) >= 0 ? 'answered' : 'notAnswered')

  if (isNaN(latestAnswerDate)) { // hmm
    latestAnswerDate = 0
  }

  let returnObject = {
    answererId,
    essaysAwaitingPeerReviewsGiven,
    latestAnswerDate
  }

  returnObject = Object.assign({}, returnObject, validateProgress(progress))

  return returnObject // resolve(...)
  //})
}

function updateCompletion(answererId, data) {
  return new Promise((resolve, reject) => {
    CourseState.findOneAndUpdate(
      { answererId, 'completion.confirmationSent': false },
      { $set: { completion: { 
        data, 
        completed: true,
        completionDate: Date.now(),
        confirmationSent: false
      }}},
      { new: true, upsert: true }
    ).exec()
    // TODO: actually check if already set
    // - confirmationSent/date/whatever...
    // - don't update if confirmation already sent?
      .then(state => resolve(state))
  })
}

const getCompleted = () => new Promise((resolve, reject) => fetchQuizIds(tags)
  .then(quizIds => {
    console.log('initing...')

    const getAnswers = QuizAnswer.aggregate([{ 
      $match: { 
        quizId: { $in: quizIds.map(quizId => mongoose.Types.ObjectId(quizId)) }, 
        spamFlags: { $lte: config.MAXIMUM_SPAM_FLAGS_TO_PASS } 
      }
    }, 
    //{ $sample: { size: 10000 } }
    ]).exec()

    const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})

    // ...check for existing confirmations
    let completed = []
    
    return Promise.all([getQuizzes, getAnswers])
      .spread((quizzes, answers) => {
        const answererIds = _.uniq(answers.map(answer => answer.answererId))
        //const quizIds = _.uniq(answers.map(answer => answer._doc.quizId.toString()))

        console.log(answererIds.length + ' unique answerers, '+ answers.length + ' answers to trawl through...')

        let answersForAnswerer = new Map()

        answers.forEach(answer => {
        /*           console.log(answersForAnswerer)
          sleep.sleep(2) */
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

        console.log('Ready initing, start crunching')    
        let count = 0
        let percentage = 0
        let percentagesShown = []

        return Promise.all(answererIds.map(answererId => {
          const progress = getProgressWithValidation(answererId, answersForAnswerer.get(answererId)/*answererId*/, quizzes)
          //console.log(progress)
          count += 1
          percentage = precise_round(count / answererIds.length * 100, 0)
          if (!_.includes(percentagesShown, percentage)) {
            percentagesShown.push(percentage)
            printProgress(percentage)
          }

          const score = calculatePercentage(progress.validation.normalizedPoints, progress.validation.maxNormalizedPoints)
          const pointsPercentage = calculatePercentage(progress.validation.points, progress.validation.maxPoints)

          //console.log(score, progress.validation.progress)  
          if (progress.validation.progress >= config.MINIMUM_PROGRESS_TO_PASS && score >= config.MINIMUM_SCORE_TO_PASS) {
            const scoreObject = {
              answererId,
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
            completed.push(scoreObject)

            //console.log('completion:', answererId)

            return updateCompletion(answererId, scoreObject)
          }
        }))
      })
      .then(_ => resolve(completed))
  }))


getCompleted().then(response => {
  console.log('\n', JSON.stringify(response))
  process.exit(0)
})


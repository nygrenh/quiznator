const resolve = require('path').resolve

require('dotenv').config({ path: resolve('../..', '.env'), silent: true })
require('app-module-path').addPath(__dirname + '/../../');

const { config, reasons } = require('app-modules/constants/course-config')
const Promise = require('bluebird')
const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird').Promise

const quizTypes = require('app-modules/constants/quiz-types');

const Quiz = require('app-modules/models/quiz');
const QuizAnswer = require('app-modules/models/quiz-answer');
const PeerReview = require('app-modules/models/peer-review');
const QuizReviewAnswer = require('app-modules/models/quiz-review-answer')
const { fetchQuizIds } = require('./utils/quiznator-tools')
const { median, printProgress } = require('./utils/mathutils')
const { precise_round } = require('app-modules/utils/math-utils')

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

// utility function to create multi-dimensional maps for answerers
function initMaps({ answers, peerReviews, reviewAnswers }) {
  function setValue({ outerMap, outerMapKey, innerMapKey, value }) {
    if (!outerMap.has(outerMapKey)) {
      outerMap.set(outerMapKey, new Map())
    }
    if (!outerMap.get(outerMapKey).has(innerMapKey)) {
      outerMap.get(outerMapKey).set(innerMapKey, [])
    }
    let newValues = outerMap.get(outerMapKey).get(innerMapKey)
    newValues.push(value)
    outerMap.get(outerMapKey).set(innerMapKey, newValues)
  }

  let answersForAnswerer = new Map()

  answers.forEach(answer => {
    setValue({ 
      outerMap: answersForAnswerer, 
      outerMapKey: answer.answererId, 
      innerMapKey: answer.quizId.toString(),
      value: answer
    })
  })

  let peerReviewsGivenForAnswerer = new Map()
  let peerReviewsReceivedForAnswerer = new Map()

  // NOTE: sourcequizid/quizid flipped!
  peerReviews.forEach(review => {
    setValue({ 
      outerMap: peerReviewsGivenForAnswerer, 
      outerMapKey: review.giverAnswererId, 
      innerMapKey: review.sourceQuizId.toString(),
      value: review
    })
    setValue({ 
      outerMap: peerReviewsReceivedForAnswerer, 
      outerMapKey: review.targetAnswererId, 
      // specific quiz:
      //innerMapKey: review.sourceQuizId.toString(),
      // specific answer:
      innerMapKey: review.chosenQuizAnswerId.toString(),
      value: review
    })
  })

  let reviewAnswersForAnswerer = new Map()

  reviewAnswers.forEach(reviewAnswer => {
    setValue({
      outerMap: reviewAnswersForAnswerer,
      outerMapKey: reviewAnswer.answererId,
      innerMapKey: reviewAnswer.quizId.toString(),
      value: reviewAnswer
    })
  })

  return {
    answersForAnswerer,
    peerReviewsGivenForAnswerer,
    peerReviewsReceivedForAnswerer,
    reviewAnswersForAnswerer
  }
}

/////

function updateConfirmations(data) {
  return new Promise((resolve, reject) => {
    const allData = _.flatten(_.concat(data.passed, data.failed, data.review))
    
    let count = 0
    let percentage = 0
    let percentagesShown = []

    return Promise.all(allData.map(entry => {
  /*       const answer = entry.answer[0] */
      const { quizId, answererId } = entry

      const answerId = entry.answer._id // [0]._id

      return QuizAnswer.findById(answerId)
        .then(answer => {
          answer.confirmed = entry.pass ? true : false
          answer.rejected = entry.fail ? true : false
          return answer.save()
        })
        .then(savedAnswer => {
          //console.log(savedAnswer)
          //console.log('entry', entry)
          const data = {
            quizId,
            answerId,
            answererId,
            status: {
              pass: entry.pass,
              review: entry.review,
              rejected: entry.fail,
              reason: entry.reason
            },
            data: {
              peerReviewsGiven: entry.givenCount,
              peerReviewsReceived: entry.receivedCount,
              spamFlags: entry.spamFlags,
              grades: entry.grades,
              gradePercentage: entry.gradePercentage,
              sadFacePercentage: entry.sadFacePercentage,

            }
          }

          count += 1
          percentage = precise_round(count / allData.length * 100, 0)
/*           if (!_.includes(percentagesShown, percentage)) {
            percentagesShown.push(percentage)
            printProgress(percentage)
          } */

          return QuizReviewAnswer.findOneAndUpdate(
            { answerId },
            { $set: data },
            { new: true, upsert: true}
          )
        })
    }))
      .then(_ => {
        return resolve()
      })
  })
}

function getEssaysForAnswerer({ answers, answererId, essayIds, peerReviewsGiven, peerReviewsReceived, reviewAnswers }) {
  let latestAnswerDate = 0

  const essaysForAnswerer = _.groupBy(essayIds.map(quizId => {
    const answersForQuiz = answers.get(quizId.toString()) || []

    if (answersForQuiz.length === 0) {
      return
    }

    let answer = _.get(answersForQuiz, 0, null)
    let newestDate = answer ? answer.createdAt : 0

    if (answersForQuiz.length > 1) {
      answersForQuiz.forEach(answerForQuiz => {
        if (answerForQuiz.createdAt > newestDate) {
          answer = answerForQuiz // [] ? // expecting [0]...
          newestDate = answerForQuiz.createdAt
        } 
      })

/*       console.log(answererId, `had ${answersForQuiz.length} answers for ${quizId}`)
      answersForQuiz.forEach(a => console.log(a.createdAt))
      console.log('I was wise enough to pick', answer.createdAt) */
    }

    latestAnswerDate = Math.max(newestDate, latestAnswerDate)

    if (!answer) { // || (!!answer && answer.length === 0)) {
      return
    }

    const given = !!peerReviewsGiven ? (peerReviewsGiven.get(quizId.toString()) || []) : []
    // only specific quiz:
    //const received = !!peerReviewsReceived ? (peerReviewsReceived.get(quizId.toString()) || []) : []
    // specific answer:
    const received = !!peerReviewsReceived ? (peerReviewsReceived.get(answer._id.toString()) || []) : []

    const spamFlags = answer.spamFlags // [0].spamFlags
    
    // don't take sad faces into account if the review is < GRADE_CUTOFF_POINT times average grade
    // (or, as it is now, median)

    const grades = _.sortBy(received.map(review => ({ sum: _.sum(_.values(review.grading)), grading: review.grading })), ['sum'])    
    let filteredAverageGrades = grades
    
    // no use calculating the median from less than three 
    if (config.MINIMUM_PEER_REVIEWS_RECEIVED >= 3) {
      const medianGrade = median(grades.map(grade => grade.sum))
      filteredAverageGrades = grades.filter(grade => grade.sum >= (config.GRADE_CUTOFF_POINT * medianGrade))
    }

    // hard coded: expects 4 questions on a scale of 1-5...
    const sadFacePercentage = _.mean(filteredAverageGrades.map(grade => 
      _.values(grade.grading)
        .filter(v => v === 1).length)) / 4 * 100 || 0
    const gradePercentage = filteredAverageGrades.length > 0 ?
      _.mean(filteredAverageGrades.map(
        grade => grade.sum
      )) / 20 * 100 : 0 

    let pass = given.length >= config.MINIMUM_PEER_REVIEWS_GIVEN && 
                received.length >= config.MINIMUM_PEER_REVIEWS_RECEIVED && // averageGrade >= 12
                sadFacePercentage < config.MAXIMUM_SADFACE_PERCENTAGE &&
                spamFlags <= config.MAXIMUM_SPAM_FLAGS_TO_PASS

    let fail = false
    let reason = ''

    if (received.length >= config.MINIMUM_PEER_REVIEWS_RECEIVED &&
        sadFacePercentage >= config.MAXIMUM_SADFACE_PERCENTAGE) {
      fail = true
      reason = reasons.REJECT_TOO_MANY_SADFACES
    }
    if (spamFlags >= config.MINIMUM_SPAM_FLAGS_TO_FAIL) {
      fail = true
      reason = reasons.REJECT_FLAGGED_AS_SPAM
    }

    let review = !pass && !fail 

    // not spam but not enough reviews? let's ignore it
    // TODO: this means confirmed/rejected under limits
    // won't be updated - a corner case but a case nonetheless
    if (review && 
      (given.length < config.MINIMUM_PEER_REVIEWS_GIVEN ||
      received.length < config.MINIMUM_PEER_REVIEWS_RECEIVED)) {
      return
    }

    const reviewAnswerForAnswer = reviewAnswers ? 
      _.get((reviewAnswers.get(quizId.toString()) || []).filter(r => r.answerId === answer._id.toString()), 0, null)
      : null
    const status = _.get(reviewAnswerForAnswer, 'status', {})

    // state manually set? let's not override it
    if ((answer.confirmed || status.pass) && !pass) {
      [pass, review, fail] = [true, false, false]
      reason = reasons.PASS_BY_REVIEWER
    } else if ((answer.rejected || status.fail) && !fail) {
      [pass, review, fail] = [false, false, true]
      reason = reasons.REJECT_BY_REVIEWER
    } 

    if (reviewAnswerForAnswer) {
      // ignore if 
      //   passing and confirmed equal
        if ((status.pass === pass && status.pass === answer.confirmed) && 
        //   review statuses equal
          (status.review === review && 
            // if review is true, neither confirmed nor rejected is set
            ((status.review && !answer.confirmed && !answer.rejected) ||
            // if review is false, exactly one of confirmed and rejected are set
            (!status.review && (
              (answer.confirmed && !answer.rejected) ||
              (!answer.confirmed && answer.rejected)
            )))
          ) && 
            //   rejected and fail equal
          (status.rejected === fail && status.rejected === answer.rejected)) {
          // let's not update if not anything to update
          return
        }
    }

    const reviewObject = {
      answererId,
      quizId: quizId,
      answer: answer,
      given,
      received,
      givenCount: given.length,
      receivedCount: received.length,
      spamFlags,
      grades: filteredAverageGrades,
      gradePercentage,
      sadFacePercentage,
      pass,
      review,
      fail,
      reason
    }

    return reviewObject

  }).filter(v => !!v), entry => {
    // just to make sure 
    if (entry.pass) { return 'pass' }
    if (entry.fail) { return 'fail' }
    return 'review'
  })
/*     entry.pass ? 'pass'
      : (entry.review ? 'review' : 'fail')) */  

  return essaysForAnswerer
}


const updateEssays = () => new Promise((resolve, reject) => 
  fetchQuizIds(tags)
    .then(quizIds => {
      if (quizIds.length === 0) { //} || answererIds.length === 0) {
        return reject(new Error('no quizids'))
      }

      const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})
      
      console.log('initing...')

      let counter = 0

      return getQuizzes
        .then(quizzes => {
          const essays = quizzes.filter(quiz => quiz.type === quizTypes.ESSAY)
          const essayIds = essays.map(quiz => quiz._id)

          const getAnswers = QuizAnswer.find({
            quizId: { $in: essayIds },
            $or: [
              { peerReviewCount: { $gte: config.MINIMUM_PEER_REVIEWS_RECEIVED } },
              { spamFlags: { $gte: config.MINIMUM_SPAM_FLAGS_TO_FAIL } }
            ]
          }).exec()

          const getReviewAnswers = QuizReviewAnswer.find({}).exec()
 /*          const getReviewAnswers = QuizReviewAnswer.aggregate([
            {
              $sort: { createdAt: -1 }
            }
          ])
          .allowDiskUse(true)
          .exec()
 */
          const getPeerReviews = PeerReview.find({ 
            sourceQuizId: { $in: essayIds }, 
          }).exec() 
    
          return Promise.all([getAnswers, getPeerReviews, getReviewAnswers])
            .spread((answers, peerReviews, reviewAnswers) => {

              // newest first
              answers.sort((a, b) => b.createdAt - a.createdAt)
              reviewAnswers.sort((a, b) => {
                if (!a.createdAt || !b.createdAt) { 
                  return 0
                }
                return b.createdAt - a.createdAt
              })
              
              const answerQuizIds = answers.map(answer => answer.quizId.toString());
              const answererIds = _.uniq(answers.map(answer => answer.answererId))
            
              const { 
                answersForAnswerer, 
                peerReviewsGivenForAnswerer, 
                peerReviewsReceivedForAnswerer,
                reviewAnswersForAnswerer } = 
              initMaps({ answers, peerReviews, reviewAnswers })

              const totalAnswers = _.sum(answererIds.map(answererId => 
                answersForAnswerer.get(answererId).size))

              console.log('In total, there are', answersForAnswerer.size, 'answerers and', totalAnswers, 'essays to check.')
              //console.log('In total, there are', answererIds.length, 'answerers and', answerQuizIds.length, 'essays to check.')

              const gradedEssays = answererIds.map(answererId => {
                counter += 1
/*                 if (counter % 100 === 0) {
                  console.log('At answerer #', counter)
                } 
*/

                const essaysForAnswerer = getEssaysForAnswerer({ 
                  answers: answersForAnswerer.get(answererId),
                  essayIds,
                  peerReviewsGiven: peerReviewsGivenForAnswerer.get(answererId),
                  peerReviewsReceived: peerReviewsReceivedForAnswerer.get(answererId),
                  reviewAnswers: reviewAnswersForAnswerer.get(answererId),
                  answererId
                })
              
                return essaysForAnswerer
              }).filter(v => !!v) //, essays => answererId) // groupBy
              
              const returned = {
                passed: gradedEssays.filter(v => v.pass).map(essay => essay.pass),
                failed: gradedEssays.filter(v => v.fail).map(essay => essay.fail),
                review: gradedEssays.filter(v => v.review).map(essay => essay.review)
              }
            
              //console.log(JSON.stringify(returned))
              //return JSON.stringify(returned)
            
              // TODO: unconfirm failed
              return returned
            
            })
        })
    })
    .then(returned => resolve(returned))
    .catch(err => reject(err))
)

updateEssays()
  .then(returned => new Promise((resolve, reject) => 
    updateConfirmations(returned)
      .then(_ => resolve(returned))
      .catch(err => reject(err))))
  .then(returned => {
    //console.log(JSON.stringify(returned))
    console.log('\ntotal passed/failed/review', returned.passed.length, returned.failed.length, returned.review.length)
    //process.exit(0)
    //return json
  })
  .catch(err => {
    console.error('error', err)
    process.exit(1)
    //return err)
  })

setInterval(() => {}, 1000)


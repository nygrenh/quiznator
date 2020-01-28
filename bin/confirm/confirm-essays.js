const resolve = require('path').resolve

require('dotenv').config({ path: resolve('../..', '.env'), silent: true })
require('app-module-path').addPath(__dirname + '/../../');

const { config } = require('./constants/config')
const { selectConfig, reasons } = require('app-modules/constants/course-config')
const Promise = require('bluebird')
const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird').Promise

const quizTypes = require('app-modules/constants/quiz-types');

const Quiz = require('app-modules/models/quiz');
const QuizAnswer = require('app-modules/models/quiz-answer');
const PeerReview = require('app-modules/models/peer-review');
const QuizReviewAnswer = require('app-modules/models/quiz-review-answer')
const { connect, fetchQuizIds } = require('./utils/quiznator-tools')
const { median, printProgress } = require('./utils/mathutils')
const { precise_round } = require('app-modules/utils/math-utils')

const sleep = require('./utils/sleep')

const DEFAULT_NEWER_THAN = 2592000000 * 6 // 6 months

sleep.sleep(5)

connect()

var args = process.argv.slice(2)

const courseConfig = selectConfig(args[args.length - 1])

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

async function updateConfirmations(data) {
/*   return new Promise((resolve, reject) => { */
  const allData = _.flatten(_.concat(data.passed, data.failed, data.review))

  let count = 0
  let percentage = 0
  let percentagesShown = []

  for (const entry of allData) {
    const { quizId, answererId } = entry

    const answerId = entry.answer._id // [0]._id

    const answer = await QuizAnswer.findById(answerId)

    if (!answer || answer.confirmed || answer.rejected) {
      continue
    }

    answer.confirmed = entry.pass ? true : false
    answer.rejected = entry.fail ? true : false

    const savedAnswer = await answer.save()

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

    await QuizReviewAnswer.findOneAndUpdate(
      { answerId },
      { $set: data },
      { new: true, upsert: true}
    )
  }
  //})
}

function getEssaysForAnswerer(data) {
  const { answers, answererId, essayIds, peerReviewsGiven, peerReviewsReceived, reviewAnswers } = data

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

    const given = peerReviewsGiven ? (peerReviewsGiven.get(quizId.toString()) || []) : []
    // only specific quiz:
    //const received = !!peerReviewsReceived ? (peerReviewsReceived.get(quizId.toString()) || []) : []
    // specific answer:
    const received = peerReviewsReceived ? (peerReviewsReceived.get(answer._id.toString()) || []) : []

    const spamFlags = answer.spamFlags // [0].spamFlags

    // don't take sad faces into account if the review is < GRADE_CUTOFF_POINT times average grade
    // (or, as it is now, median)

    const grades = _.sortBy(received.map(review => ({ sum: _.sum(_.values(review.grading)), grading: review.grading })), ['sum'])
    let filteredAverageGrades = grades

    // no use calculating the median from less than three
    if (courseConfig.MINIMUM_PEER_REVIEWS_RECEIVED >= 3) {
      const medianGrade = median(grades.map(grade => grade.sum))
      filteredAverageGrades = grades.filter(grade => grade.sum >= (courseConfig.GRADE_CUTOFF_POINT * medianGrade))
    }

    // hard coded: expects 4 questions on a scale of 1-5...
    const sadFacePercentage = _.mean(filteredAverageGrades.map(grade =>
      _.values(grade.grading)
        .filter(v => v === 1).length)) / 4 * 100 || 0
    const gradePercentage = filteredAverageGrades.length > 0 ?
      _.mean(filteredAverageGrades.map(
        grade => grade.sum
      )) / 20 * 100 : 0

    let pass = given.length >= courseConfig.MINIMUM_PEER_REVIEWS_GIVEN &&
                received.length >= courseConfig.MINIMUM_PEER_REVIEWS_RECEIVED && // averageGrade >= 12
                sadFacePercentage < courseConfig.MAXIMUM_SADFACE_PERCENTAGE &&
                spamFlags <= courseConfig.MAXIMUM_SPAM_FLAGS_TO_PASS

    let fail = false
    let reason = ''

    if (received.length >= courseConfig.MINIMUM_PEER_REVIEWS_RECEIVED &&
        sadFacePercentage >= courseConfig.MAXIMUM_SADFACE_PERCENTAGE) {
      fail = true
      reason = reasons.REJECT_TOO_MANY_SADFACES
    }
    if (spamFlags >= courseConfig.MINIMUM_SPAM_FLAGS_TO_FAIL) {
      fail = true
      reason = reasons.REJECT_FLAGGED_AS_SPAM
    }

    let review = !pass && !fail

    // not spam but not enough reviews? let's ignore it
    // TODO: this means confirmed/rejected under limits
    // won't be updated - a corner case but a case nonetheless
    if (review &&
      (given.length < courseConfig.MINIMUM_PEER_REVIEWS_GIVEN ||
      received.length < courseConfig.MINIMUM_PEER_REVIEWS_RECEIVED)) {
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
    if (entry.review) { return 'review' }
  })

  return essaysForAnswerer
}


const updateEssays = async () => {
  try {
    const quizIds = await fetchQuizIds(courseConfig.COURSE_ID)

    if (quizIds.length === 0) { //} || answererIds.length === 0) {
      return Promise.reject(new Error('no quizids'))
    }


    console.log('initing...')

    let counter = 0

    const currentDate = new Date()
    const createdAt = {
      $gte: new Date(currentDate - DEFAULT_NEWER_THAN),
    }

    const quizzes = await Quiz.findAnswerable({ _id: { $in: quizIds }})

    const essays = quizzes.filter(quiz => quiz.type === quizTypes.ESSAY)
    const essayIds = essays.map(quiz => quiz._id)

    const answers = await QuizAnswer.find({
      quizId: { $in: essayIds },
      deprecated: { $ne: true },
      createdAt,
      $or: [
        { peerReviewCount: { $gte: courseConfig.MINIMUM_PEER_REVIEWS_RECEIVED } },
        { spamFlags: { $gte: courseConfig.MINIMUM_SPAM_FLAGS_TO_FAIL } }
      ]
    }).exec()

    const reviewAnswers = await QuizReviewAnswer.find({ createdAt }).exec()

    const peerReviews = await PeerReview.find({
      sourceQuizId: { $in: essayIds },
      createdAt,
    }).exec()

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

    console.log('In total, there are', answersForAnswerer.size, 'answerers and', totalAnswers, 'essays to check for', courseConfig.COURSE_ID)

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
      review: gradedEssays.filter(v => v.review).map(essay => essay.review),
    }

    return Promise.resolve(returned)
  } catch (err) {
    console.error(err)
    return Promise.reject(err)
  }
}

updateEssays()
  .then(async returned => {
    await updateConfirmations(returned)
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

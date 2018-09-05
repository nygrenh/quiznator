const resolve = require('path').resolve

require('dotenv').config({ path: resolve('../..', '.env'), silent: true })
require('app-module-path').addPath(__dirname + '/../../');

const { config } = require('./constants/config')
const { selectConfig } = require('app-modules/constants/course-config')
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
const sleep = require("sleep")

connect()

var args = process.argv.slice(2)

const courseConfig = selectConfig(args[0])

function timeConversion(millisec) {

  var seconds = (millisec / 1000).toFixed(1);

  var minutes = (millisec / (1000 * 60)).toFixed(1);

  var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

  return hours + " hrs"
}

const main = async () => {
  const quizIds = await fetchQuizIds(courseConfig.COURSE_ID)
  const essayQuizzes = await Quiz.find({ _id: { $in: quizIds }, type: 'ESSAY' })
  const essayQuizIds = essayQuizzes.map(quiz => quiz._id)
  const essayAnswers = await QuizAnswer.find({ quizId: { $in: essayQuizIds }}).sort({ createdAt: - 1 })
  const peerReviews = await PeerReview.find({ sourceQuizId: { $in: essayQuizIds }})

  const today = new Date()

  const peerReviewsPerAnswer = _.groupBy(peerReviews, 'chosenQuizAnswerId')

  essayQuizzes.map(quiz => {
    console.log(quiz.title)

    const answersPerQuiz = essayAnswers.filter(answer => answer.quizId.toString() === quiz._id.toString())
    const answerers = _.uniq(answersPerQuiz.map(p => p.answererId))
    const answersPerAnswerer = _.groupBy(answersPerQuiz, 'answererId')
    const newestAnswers = Object.values(answersPerAnswerer).map(a => a[0])
    const answersPerPrCount = _.groupBy(newestAnswers, 'peerReviewCount')
    const peerReviewsPerQuiz = peerReviews.filter(pr => pr.sourceQuizId.toString() === quiz._id.toString())

    Object.entries(answersPerPrCount).forEach(([count, answers]) => {
      //console.log(answers.map(answer => _.get(_.get(peerReviewsPerAnswer, answer._id.toString(), []), "createdAt")))
      const avgDatePerAnswers = count === 0 
        ? NaN 
        : _.mean(
          answers.map(answer => {
            const prs = _.get(peerReviewsPerAnswer, answer._id.toString(), []) 
            
            if (prs.length === 0) {
              return 0
            }

            const prsSorted = _.orderBy(
              prs,
              ['createdAt'],
              ['desc']
            )

            return prsSorted[0].createdAt.getTime() - answer.createdAt.getTime()
          })
        )

      const avgAge = isNaN(avgDatePerAnswers) ? '' : timeConversion(avgDatePerAnswers)
      console.log("%s: %s \t\t %s", ('' + count).padStart(2), ('' + answers.length).padStart(5), avgAge)
      //console.log(today - avgAge)
    })

    console.log('')
  })
}

main().then(() => process.exit(0))
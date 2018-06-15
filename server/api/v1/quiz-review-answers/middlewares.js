const _ = require('lodash')
const mongoose = require('mongoose')
const co = require('co');

const QuizReviewAnswer = require('app-modules/models/quiz-review-answer')
const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')

const middlewares = {
  getQuizReviewAnswers,
  updateQuizReviewAnswerStatus,
}


function getQuizReviewAnswers(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req)
    const answererId = options.getAnswererId(req) || null
    const queryOptions = options.getOptions(req) || null
    
    let query = [
      { $match: { quizId: mongoose.Types.ObjectId(quizId) } }
    ]
    if (answererId) {
      query.push({ $match: { answererId: answererId } })
    }

    if (queryOptions && queryOptions.length > 0) {
      queryOptions.forEach(option => {
        query.push({ $match: { [`status.${option}`]: true } })
      })
    }

    return QuizReviewAnswer.aggregate(query) // getReviewable(quizId, answererId)
      .then(statuses => {
        
        return Promise.all(statuses.map(status => QuizAnswer.findOne({ _id: status.answerId })))
          .then(answers => {
            return _.reduce(statuses, (obj, status) => {
              obj.push(Object.assign({}, status, { answer: answers.filter(answer => answer._id.equals(status.answerId))[0] }))
              return obj
            }, [])
          })
      })
      .then(statuses => {
        req.statuses = statuses

        return next()
      })
  }
}

function updateQuizReviewAnswerStatus() {
  return (req, res, next) => {
    co(function* () {
      const { status } = req.body
      const { id } = req.params

      console.log(status, id)

      const reviewAnswer = yield QuizReviewAnswer.findOne({ answerId: id })

      if (!reviewAnswer) {
        return Promise.reject('review answer not found')
      }

      if (!status.pass && !status.review && !status.rejected) {
        return Promise.reject('no pass/review/rejected for answer!')
      }

      if ((status.pass && (status.review || status.rejected))
      || (status.review && (status.pass || status.rejected))
      || (status.rejected && (status.review || status.pass))) {
        return Promise.reject('only one status of pass/review/rejected permitted')
      }

      reviewAnswer.status.pass = status.pass || false
      reviewAnswer.status.review = status.review || false
      reviewAnswer.status.rejected = status.rejected || false
      reviewAnswer.status.reason = status.reason || null

      yield reviewAnswer.save()

      req.reviewAnswer = reviewAnswer

      return next()
    })
    .catch(next)
  }
}

module.exports = middlewares
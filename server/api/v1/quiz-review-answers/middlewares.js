const _ = require('lodash')
const mongoose = require('mongoose'
)
const QuizReviewAnswer = require('app-modules/models/quiz-review-answer')
const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')

const middlewares = {
  getQuizReviewAnswers,
  updateQuizAnswerConfirmation,
  updateQuizAnswerRejection
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

function updateQuizAnswerConfirmation() {
  return (req, res, next) => {
    return next()
  }
}

function updateQuizAnswerRejection() {
  return (req, res, next) => {
    return next()
  }
}

module.exports = middlewares
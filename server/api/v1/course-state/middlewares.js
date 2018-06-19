const Promise = require('bluebird')
const mongoose = require('mongoose')
const errors = require('app-modules/errors');

const CourseState = require('app-modules/models/course-state')

function getCourseState(options) {
  return (req, res, next) => {
    const query = {
      courseId: options.getCourseId(req)
    }

    const answererId = options.getAnswererId(req)
    if (answererId) {
      query.answererId = answererId
    }

    const allInfo = options.getAllInfo(req)
    const filter = !allInfo ? {
      answererId: true,
      "completion.completed": true,
    } : undefined

    const getState = CourseState.find(query, filter).exec()

    getState
      .then(state => {

        if (!!state && typeof state === 'object' && state.length > 0) {
          if (answererId) {
            req.state = state[0]
          } else {
            req.state = state
          }
        }
        
        return next()
      })
  }
}

function updateCourseStateAnswer(options) {
  return (req, res, next) => {
    const body = options.getBody(req)

    const { answererId, courseId, answerId, confirmed, rejected } = body

    if (confirmed && rejected) {
      return next(new errors.InvalidRequestError('cannot be both confirmed and rejected'))
    }

    if (!answererId || !courseId || !answerId) {
      return next(new errors.InvalidRequestError('not enough parameters'))
    }

    CourseState.findOneAndUpdate({
      answererId,
      courseId,
      "completion.data.answerValidation": {
        $elemMatch: {
          answerId: mongoose.Types.ObjectId(answerId)
        }
      }
      }, {
        $set: { 
          'completion.data.answerValidation.$.confirmed': confirmed,
          'completion.data.answerValidation.$.rejected': rejected,
        }
      }, {
        new: true
      }).exec()
      .then(answerValidation => {
        req.answerValidation = answerValidation

        return next()
      })
  }
}

function getDistribution(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req)

    CourseState.find({
      "completion.data.answerValidation": {
        $elemMatch: { 
          quizId: mongoose.Types.ObjectId(quizId) 
        }
      }
    },
    {
      answererId: 1,
      "completion.data.answerValidation.$": 1
    })
      .then(distribution => {
        req.distribution = distribution

        return next()
      })
  }
}

module.exports = { getCourseState, getDistribution, updateCourseStateAnswer }
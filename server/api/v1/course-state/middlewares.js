const Promise = require('bluebird')
const mongoose = require('mongoose')
const errors = require('app-modules/errors');

const Quiz = require('app-modules/models/quiz')
const CourseState = require('app-modules/models/course-state')
const QuizAnswer = require('app-modules/models/quiz-answer')

const _ = require('lodash')

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
      'completion.completed': true
    } : undefined

    const getState = CourseState.find(query, filter).exec()

    getState
      .then(state => {
        req.state = {}

        if (!!state && typeof state === 'object' && state.length > 0) {
          if (answererId) {
            req.state = state[0]
          } else {
            req.state = state
          }
        }

        return next()
      })
      .catch(next)
  }
}

function getCompleted(options) {
  return (req, res, next) => {
    const courseIds = (options.getCourseIds(req) || '').split(',').filter(courseId => !!courseId) 

    req.answererIds = []

    if (courseIds.length === 0) {
      return next()  
    }

    const query = {
      courseId: { $in: courseIds },
      'completion.completed': true
    }

    CourseState.distinct('answererId', query)
      .then(answererIds => {
        req.answererIds = answererIds

        return next()
      })
      .catch(next)
  }
}

function getStats(options) {
  return (req, res, next) => {
    const courseId = options.getCourseId(req)

    req.stats = {}

    if (!courseId) {
      return next()
    }

    let quizzes = []

    const getQuizzes = Quiz.find({ tags: { $in: [courseId] } }, { _id: 1, title: 1 })

    getQuizzes
      .then(quizResult => {
        quizzes = quizResult

        const getAnswers = QuizAnswer.find({ quizId: { $in: quizzes.map(q => q._id) }}, { _id: 1, quizId: 1, answererId: 1 })
        const getCompleted = CourseState.distinct('answererId', { courseId, 'completion.completed': true })
            
        return Promise.all([getAnswers, getCompleted])
      })
      .spread((answers, completed) => {
        const answersByQuizId = _.groupBy(answers, 'quizId')

        const answerersByQuizId = _.reduce(
          answersByQuizId,
          (obj, value, key) => {
            obj[key] = _.uniq((value || []).map(v => v.answererId))        
            
            return obj
          },
          {}
        )

        const quizStats = _(quizzes)
          .sortBy(q => (q.title.match(/\d+/) || []).map(Number)[0])
          .values() 
          .map(q => ({
            quiz: q.title,
            answerCount: _.get(answersByQuizId, q._id, []).length,
            answererCount: _.get(answerersByQuizId, q._id, []).length, 
          }))

        req.stats = {
          quizzes: quizStats,
          answerers: _.uniq(answers.map(a => a.answererId)).length,
          completed: completed.length,
        }

        return next()
      })
      .catch(() => next())
  }
}

function updateCourseStateAnswer(options) {
  return (req, res, next) => {
    const body = options.getBody(req)

    const { answererId, courseId, answerId, confirmed, rejected } = body

    if (confirmed && rejected) {
      return next(new errors.InvalidRequestError('cannot be both confirmed and rejected'))
    }

    if (!answererId || !courseId || !answerId) {
      return next(new errors.InvalidRequestError('not enough parameters'))
    }

    CourseState.findOneAndUpdate({
      answererId,
      courseId,
      'completion.data.answerValidation': {
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

    CourseState.aggregate([
      { $project: {
        answererId: 1,
        validation: {
          $filter: {
            input: '$completion.data.answerValidation',
            as: 'answerValidation',
            cond: { $eq: ['$$answerValidation.quizId', mongoose.Types.ObjectId(quizId) ] }
          },
        }
      }},
      { $match: {
        'validation.0': { $exists: true }
      }},
      { $project: {
        answererId: 1,
        'validation.confirmed': 1,
        'validation.rejected': 1,
        'validation.deprecated': 1,
        'validation.type': 1,
        'validation.normalizedPoints': 1,
      }}
    ])
      .then(distribution => {
        req.distribution = distribution

        return next()
      })
  }
}

module.exports = { getCompleted, getStats, getCourseState, getDistribution, updateCourseStateAnswer }
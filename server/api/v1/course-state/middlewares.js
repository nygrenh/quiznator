const Promise = require('bluebird')
const mongoose = require('mongoose')
const errors = require('app-modules/errors');

const Quiz = require('app-modules/models/quiz')
const CourseState = require('app-modules/models/course-state')
const QuizAnswer = require('app-modules/models/quiz-answer')
const PeerReview = require('app-modules/models/peer-review')

const quizTypes = require('app-modules/constants/quiz-types');

const _ = require('lodash')

const util = require('util')

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
    let essayQuizzes = []

    const getQuizzes = Quiz.find({ tags: { $in: [courseId] } }, { _id: 1, title: 1, type: 1 })

    getQuizzes
      .then(quizResult => {
        quizzes = quizResult

        const getAnswers = QuizAnswer.find(
          { quizId: { $in: quizzes.map(q => q._id) }}, 
          { _id: 1, quizId: 1, answererId: 1 },
        ).sort(
          { createdAt: - 1 } 
        )
        const getCompleted = CourseState.distinct('answererId', 
          { courseId, 'completion.completed': true })
        let essayQuizzes = quizzes.filter(q => q.type === quizTypes.ESSAY)
        const essayQuizIds = essayQuizzes.map(q => q._id)
        const getPeerReviews = PeerReview.find(
          { sourceQuizId: { $in: essayQuizIds } },
          // todo: don't return unneeded
        )

        return Promise.all([getAnswers, getCompleted, getPeerReviews])
      })
      .spread((answers, completed, peerReviews) => {
        const answersByQuizId = _.groupBy(answers, 'quizId')

        const answerersByQuizId = _.reduce(
          answersByQuizId,
          (obj, value, key) => {
            obj[key] = _.uniq((value || []).map(v => v.answererId))        
            
            return obj
          },
          {}
        )

        const isEssay = id => _.includes(essayQuizIds, id)

        const essayQuizzes = quizzes.filter(q => q.type === quizTypes.ESSAY)
        const essayQuizIds = quizzes.map(q => q._id)
        const essayAnswers = answers.filter(a => isEssay(a.quizId))

        const essayStats = getEssayStats({
          essayQuizzes,
          essayAnswers,
          peerReviews
        })  

        console.log(essayStats)
        const quizStats = _(quizzes)
          .sortBy(q => (q.title.match(/\d+/) || []).map(Number)[0])
          .values() 
          .map(q => ({
            quiz: q.title,
            peerReviews: isEssay(q._id.toString()) ? {
              received: essayStats.filter(e => e.quizId === q._id) 
            } : null,
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

function getEssayStats(data) {
  const { essayQuizzes, essayAnswers, peerReviews } = data

  const peerReviewsPerAnswer = _.groupBy(peerReviews, 'chosenQuizAnswerId')

  return _(essayQuizzes)
    .orderBy(a => parseInt(a.title.match(/(\d+)/g)[0])) // eh
    .value()
    .map(quiz => {
      const answersPerQuiz = essayAnswers.filter(answer => answer.quizId.toString() === quiz._id.toString())
      const answerers = _.uniq(answersPerQuiz.map(p => p.answererId))
      const answersPerAnswerer = _.groupBy(answersPerQuiz, 'answererId')
      const newestAnswers = Object.values(answersPerAnswerer).map(a => a[0].deprecated ? null : a[0]).filter(v => !!v)
      const answersPerPrCount = _.groupBy(newestAnswers, 'peerReviewCount')
      const peerReviewsPerQuiz = peerReviews.filter(pr => pr.sourceQuizId.toString() === quiz._id.toString())

      const answerData = Object.entries(answersPerPrCount).map(([count, answers]) => {
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

        return { count: parseInt(count), answers: answers.length, avgAge }
      })

      return { 
        quizId: quiz._id, 
        quizTitle: quiz.title, 
        distinctAnswerers: answerers.length, 
        totalAnswers: answersPerQuiz.length, 
        totalPeerReviews: peerReviewsPerQuiz.length,
        data: answerData }
    })

}

function timeConversion(millisec) {
  var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

  return parseFloat(hours)
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
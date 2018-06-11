const Promise = require('bluebird')
const mongoose = require('mongoose'
)
const CourseState = require('app-modules/models/course-state')

function getCourseState(options) {
  return (req, res, next) => {
    const answererId = options.getAnswererId(req)
    const courseId = options.getCourseId(req)

    const getState = CourseState.find({ 
      answererId,
      courseId 
    }).exec()

    getState
      .then(state => {

        if (!!state && typeof state === 'object' && state.length > 0) {
          req.state = state[0]
        }
        
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

module.exports = { getCourseState, getDistribution }
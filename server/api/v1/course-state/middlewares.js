const Promise = require('bluebird')
const mongoose = require('mongoose'
)
const CourseState = require('app-modules/models/course-state')

function getCourseState(options) {
  return (req, res, next) => {
    const getState = CourseState.find({ answererId: options.getAnswererId(req) }).exec()

    getState
      .then(state => {

        req.state = state
        
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
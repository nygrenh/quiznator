const Promise = require('bluebird')

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

module.exports = { getCourseState }
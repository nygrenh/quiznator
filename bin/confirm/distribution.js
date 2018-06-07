const resolve = require('path').resolve
require('app-module-path').addPath(__dirname + '/../../');

require('dotenv').config({ silent: true });

const { config } = require('./constants/config')
const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise

const quizTypes = require('app-modules/constants/quiz-types')

const CourseState = require('app-modules/models/course-state')
const Quiz = require('app-modules/models/quiz')

const { fetchQuizIds } = require('./utils/quiznator-tools')
const { median, calculatePercentage, printProgress } = require('./utils/mathutils')
const { precise_round } = require('app-modules/utils/math-utils')

mongoose.connect(config.DB_URI, err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
})

let tags = []

_.map(_.range(1, config.PARTS + 1), (part) => {
  _.map(_.range(1, config.SECTIONS_PER_PART + 1), (section) => {
    tags.push(`${config.COURSE_SHORT_ID}_${part}_${section}`)
  })
})

const calculateDistribution = () => new Promise((resolve, reject) => 
  fetchQuizIds(tags)
    .then(quizIds => {
      const quizIdsMap = quizIds.map(quizId => mongoose.Types.ObjectId(quizId))
      const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIdsMap }})

      const getCourseStates = CourseState.find({}).exec()

      return Promise.all([getQuizzes, getCourseStates])
        .spread((quizzes, states) => {
          return quizzes.map(quiz => {
            const quizId = quiz._id

            const scoresPerQuiz = states.map(state => state.completion.data.answerValidation.filter(answer => answer.quizId.equals(quizId))[0])

            const distribution =  _.reduce(scoresPerQuiz, (obj, score) => {
              if (!score) {
                return obj
              }

              const key = score.normalizedPoints

              if (!obj[key]) {
                obj[key] = 0
              }
              obj[key] = obj[key] + 1
              return obj
            }, {})
            
            return {
              title: quiz.title,
              distribution
            }
          })
        })
    })
    .then(data => resolve(data))
)

calculateDistribution()
  .then(response => {
    response.map(data => {
      console.log(data.title)
      const total = _.sum(Object.values(data.distribution))
      const keys = Object.keys(data.distribution)
      keys.sort()
      keys.reverse()

      keys.map(key => {
        const value = data.distribution[key]
        const percent = total > 0 ? Math.round(value / total * 100) : 0
        console.log(key + ' ' + value + ' (' + percent + '%)')
      })
    })
    process.exit(0)
  })
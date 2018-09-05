#!/usr/bin/env node

const resolve = require('path').resolve
require('app-module-path').addPath(__dirname + '/../../');

require('dotenv').config({ path: resolve('../..', '.env'), silent: true })

const { config } = require('./constants/config')
const { selectConfig } = require('app-modules/constants/course-config')
const Promise = require('bluebird');
const _ = require('lodash');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise

const { connect, fetchQuizIds } = require('./utils/quiznator-tools')

const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')
const CourseState = require('app-modules/models/course-state')

const { precise_round } = require('app-modules/utils/math-utils')


const sleep = require("sleep")

connect()

var args = process.argv.slice(2)

const courseConfig = selectConfig(args[0])

const main = async () => {
  const quizIds = await fetchQuizIds(courseConfig.COURSE_ID)

  const countableQuizIds = await Promise.all(quizIds.map(async (quizId) => {
    const quiz = await Quiz.findOne({ _id: quizId })
    if (!_.includes(quiz.tags, 'ignore')) {
      return quizId
    }
    return
  })).filter(v => !!v)

  const courseStates = await CourseState
    .find({})
    .exec()

  const maxNormalizedPoints = countableQuizIds.length

  console.log('got %d states...', courseStates.length)

  let count = 0

  return await Promise.all(courseStates.map(async (courseState) => {
    // reset completion date if user hasn't completed the course
/*     if (!courseState.completion.completed) {
      courseState.completion.completionDate = null
      await courseState.save()

      return Promise.resolve()
    } */

    // group users answer validation and answers 
    const answers = await Promise.all(courseState.completion.data.answerValidation.map(async (entry) => {
      const answer = await QuizAnswer.find({ _id: entry.answerId }) 

      return {
        answer: answer[0],
        validation: entry
      }
    }))

    const sortedAnswers = _.sortBy(answers, 'answer.createdAt')

    let normalizedPoints = 0
    let completedAmount = 0
    let completed = false
    let completionDate = null

    let prevDate = 0

    sortedAnswers.some((entry) => {
      if (prevDate > entry.answer.createdAt) {
        throw new Error('you fail as a human being')
      }
      prevDate = entry.answer.createdAt
      // exclude ignored
      if (_.includes(countableQuizIds, entry.answer.quizId.toString())) {
        normalizedPoints += entry.validation.normalizedPoints
        completedAmount += entry.answer.confirmed ? 1 : 0
      }

      let progress = precise_round(completedAmount / maxNormalizedPoints * 100, 2)
      let score = precise_round(normalizedPoints / maxNormalizedPoints * 100, 2)

      if (progress >= courseConfig.MINIMUM_PROGRESS_TO_PASS &&
          score >= courseConfig.MINIMUM_SCORE_TO_PASS) {
          completionDate = entry.answer.createdAt
          completed = true
          count++
          console.log(courseState.answererId)
    
          return true
        }
      
      return false
    })

    courseState.completion.completionDate = completionDate
    courseState.completion.completed = completed
    //await courseState.save()

    return Promise.resolve()
  }))
  .then(() => console.log("DONE: " + count))
  .catch(err => console.warn(err))
}

main()

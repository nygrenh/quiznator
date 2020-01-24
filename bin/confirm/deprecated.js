#!/usr/bin/env node

const resolve = require('path').resolve
require('app-module-path').addPath(__dirname + '/../../');

require('dotenv').config({ path: resolve('../..', '.env'), silent: true })

const { selectConfig } = require('app-modules/constants/course-config')
const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise
const sleep = require('./utils/sleep').sleep
const QuizAnswer = require('app-modules/models/quiz-answer')

const { connect, fetchQuizIds } = require('./utils/quiznator-tools')

// sleep(2)

const connection = connect()

var args = process.argv.slice(2)

const courseConfig = selectConfig(args[args.length - 1])

const main = async () => {
  const quizIds = await fetchQuizIds(courseConfig.COURSE_ID)
  const quizIdsMap = quizIds.map(quizId => mongoose.Types.ObjectId(quizId))

  const answersPerAnswerer = await QuizAnswer
    .aggregate([
      { $match: { quizId: { $in: quizIdsMap } } },
      { $group: { _id: '$answererId', answers: { $push: '$$ROOT' } } },
    ])
    .allowDiskUse(true)
    .exec()

  const answersPerAnswererPerQuiz = _(answersPerAnswerer)
    .reduce(
      (obj, entry) => {
        obj[entry._id] = _(entry.answers)
          .sortBy('createdAt')
          .reverse()
          .groupBy('quizId')
          .value()

        return obj
      }, {}
    )

  var answererData = {}
  var deprecatedNewest = {}
  var count = 0

  await Object.entries(answersPerAnswererPerQuiz).forEach(async ([answererId, answers]) => {
    await Promise.all(
      Object.entries(answers).map(async ([quizId, answersPerQuizId]) => {
        if (answersPerQuizId[0].deprecated) {
          deprecatedNewest[answererId] = [ ...(deprecatedNewest[answererId] || []), answersPerQuizId[0]._id ]
          // console.log('%s has deprecated newest answer in %s', answererId, quizId)
        }

        if (!answersPerQuizId || answersPerQuizId.length <= 1) {
          return Promise.resolve()
        }

        if (answersPerQuizId[0].createdAt < answersPerQuizId[1].createdAt) {
          throw new Error('the sorting is borked', answersPerQuizId)
        }

        const deprecatedIds = answersPerQuizId
          .slice(1)
          .map(a => !a.deprecated ? mongoose.Types.ObjectId(a._id) : null)
          .filter(v => !!v)

        count += deprecatedIds.length

        answererData[answererId] = { 
          ...answererData[answererId], 
          [quizId.toString()]: deprecatedIds 
        }

        return await QuizAnswer
          .updateMany(
            { _id: { $in: deprecatedIds } },
            { $set: { deprecated: true }}
          )
      })
    )

  })

  return Promise.resolve({ deprecated: answererData, deprecatedNewest: deprecatedNewest })
}

main()
  .then(res => { 
    console.log(JSON.stringify(res, null, 2))
    // process.exit(0)
  })
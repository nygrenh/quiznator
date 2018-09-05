#!/usr/bin/env node

const resolve = require('path').resolve
require('app-module-path').addPath(__dirname + '/../../');

require('dotenv').config({ path: resolve('../..', '.env'), silent: true })

const { selectConfig } = require('app-modules/constants/course-config')
const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise

const QuizAnswerSpamFlag = require('app-modules/models/quiz-answer/quiz-answer-spam-flag')
const QuizAnswer = require('app-modules/models/quiz-answer')

const { connect, fetchQuizIds } = require('./utils/quiznator-tools')

connect()

var args = process.argv.slice(2)

const courseConfig = selectConfig(args[args.length - 1])

const main = async () => {
  const quizIds = await fetchQuizIds(courseConfig.COURSE_ID)
  const spamFlags = await QuizAnswerSpamFlag.find({})
  let answerMap = {}
  let answererMap = []

  answererMap = await Promise.all(spamFlags.map(async (flag) => {
    const str = flag._id
    const answererId = str.substr(0, str.length - 25)
    const answerId = str.substr(str.length - 24, str.length)

    let answer = answerMap[answerId]

    if (!answer) {
      answerMap[answerId] = await QuizAnswer.findOne({ _id: mongoose.Types.ObjectId(answerId) })
      answer = answerMap[answerId]

      if (!answer) return
    }
  
    const quizId = answer.quizId.toString()

    if (!_.includes(quizIds, quizId)) {
      return
    }

    return answererId
  })).filter(k => !!k)

  answererMap = _(answererMap)
    .countBy()
    .map((v, k) => ({ name: k, count: v}))
    .sortBy('count')
    .reverse()
    .value()
  
  answererMap.forEach(a => console.log(a))
  process.exit(0)
}

main()
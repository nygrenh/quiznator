const mongoose = require('mongoose')
const co = require('co');
const quizTypes = require('app-modules/constants/quiz-types');

const QuizScore = require('app-modules/models/quiz-score')
const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')

const middlewares = {
  getAnswerersScores,
  createQuizScore,
  validate
}

function getAnswerersScores(options) {
  return (req, res, next) => {
    const answererId = options.getAnswererId(req)
    const quizzes = (options.getQuizzes(req) || '').split(',').filter(id => !!id);

    if (!answererId) {
      next()
    }

    QuizScore.getStatsByQuizIds(answererId, quizzes)
      .then(scores => {
        req.scores = scores
        
        return next()
      })
      .catch(err => next(err))
  }
}

function createQuizScore(options) {
  return (req, res, next) => {
    const answererId = options.getAnswererId(req)
    const quizId = options.getQuizId(req)
    const score = options.getScore(req)
    const meta = options.getMeta(req)

    if (!answererId || !score) {
      next()
    }

    const attributes = {
      answererId,
      quizId,
      score,
      meta
    }

    QuizScore.findOneAndUpdate(
      { answererId, quizId },
      { $set: attributes },
      { 
        new: true, 
        upsert: true
      }
    )
    .then(newScore => {
      req.newScore = newScore

      return next()
    })
    .catch(err => next(err))
  }
}

function validate(options) {
  return (req, res, next) => {
    co(function* () {
      const answererId = options.getAnswererId(req)
      const body = options.getBody(req)
      
      let quizIds = body.quizIds

      quizIds = quizIds.map(id => mongoose.Types.ObjectId(id))

      const quizzes = yield Quiz.getByIds(quizIds)
      const answers = yield QuizAnswer.getByQuizIds(quizIds, answererId)

      let validation = []
      let totalPoints = 0
      let totalMaxPoints = 0
      let totalNormalizedPoints = 0

      quizzes.forEach(quiz => {
        let points = 0
        let maxPoints = 1
        let normalizedPoints = 0

        const { regex, multi, rightAnswer } = quiz.data.meta
        const { items, choices } = quiz.data 
        const answer = answers.filter(v => v.quizId.equals(quiz._id))

        if (answer.length === 0) {
          return
        }
        const { data } = answer[0]
        const itemAmount = Math.max(items ? items.length : 0, 1)

        switch (quiz.type) {
          case quizTypes.ESSAY:
            points = answer.confirmed ? 1 : 0
            normalizedPoints = points
            break
          case quizTypes.RADIO_MATRIX:
            points = multi
              ? (items.map(item => 
                data[item.id].map(k => rightAnswer[item.id].indexOf(k) >= 0).every(v => !!v)
             && rightAnswer[item.id].map(k => data[item.id].indexOf(k) >= 0).every(v => !!v)
              ).filter(v => v).length)
              : (items.map(item => 
                rightAnswer[item.id].indexOf(data[item.id]) >= 0
              ).filter(v => v).length)
            normalizedPoints = points / itemAmount
            maxPoints = itemAmount
            break
          case quizTypes.MULTIPLE_CHOICE:
            points = rightAnswer.some(o => o === data) ? 1 : 0
            normalizedPoints = points
            break
          case quizTypes.OPEN:
            if (regex) {
              let re = new RegExp(rightAnswer)
              points = !!re.exec(data.trim().toLowerCase()) ? 1 : 0
            } else {
              points = data.trim().toLowerCase() === rightAnswer.trim().toLowerCase() ? 1 : 0
            }
            normalizedPoints = points
            break
          case quizTypes.MULTIPLE_OPEN:
            if (regex) {
              points = items.map(item => {
                let re = new RegExp(rightAnswer[item.id])
                return !!re.exec(data[item.id].trim().toLowerCase())
              }).filter(v => v).length              
            } else {
              points = items.map(item => 
                data[item.id].trim().toLowerCase() === rightAnswer[item.id].trim().toLowerCase()
              ).filter(v => v).length
            }
            normalizedPoints = points / itemAmount
            maxPoints = itemAmount
            break
          default:
            break
        }

        totalPoints += points
        totalMaxPoints += maxPoints
        totalNormalizedPoints += normalizedPoints

        validation.push({
              quizId: quiz._id,
              points,
              maxPoints,
              normalizedPoints: precise_round(normalizedPoints, 2)
            })
      })
      
      req.validation = {
        quizzes: validation,
        answererId,
        points: totalPoints,
        maxPoints: totalMaxPoints,
        normalizedPoints: precise_round(totalNormalizedPoints, 2),
        maxNormalizedPoints: quizzes.length
      }

      return next()
    }).catch(next)
  }
}

function precise_round(num,decimals) {
  var sign = num >= 0 ? 1 : -1;
  return parseFloat((Math.round((num*Math.pow(10,decimals)) + (sign*0.001)) / Math.pow(10,decimals)).toFixed(decimals));
}

module.exports = middlewares
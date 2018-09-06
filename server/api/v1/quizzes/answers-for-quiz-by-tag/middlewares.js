const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')
const mongoose = require('mongoose')

function getAnswersByAnswererByTag(options) {
  return (req, res, next) => {
    const answererId = options.getAnswererId(req)
    const queryTags = (options.getTags(req) || '').split(',').filter(tag => !!tag);
    const onlyConfirmed = options.getConfirmed ? options.getConfirmed(req) : false

    if (queryTags.length == 0) {
      return next()
    }

    let query = { tags: { $all: queryTags } }

    Quiz
      .find(query)
    //.distinct('_id')
      .exec()
      .then(quizzes => {
        let quizMap = []
        quizzes.map(quiz => quizMap[quiz.id] = quiz)
        return QuizAnswer.getLatestDistinctAnswer(answererId, quizMap, {
          onlyConfirmed
        })
      })
      .then(answers => {
        req.quizsAnswers = answers

        return next()
      })
      .catch(err => next(err))
  }
}

function getAnswersByTag(options) {
  return (req, res, next) => {
    const queryTags = (options.getTags(req) || '').split(',').filter(tag => !!tag);

    if (queryTags.length === 0) {
      return next()
    }

    let query = { tags: { $all: queryTags } }

    Quiz
      .find(query)
      .distinct('_id')
      .exec()
      .then(quizIds => {
        return QuizAnswer.findDistinctlyByAnswerer({
          quizId: { $in: quizIds.map(id => mongoose.Types.ObjectId(id)) }
        })
      })
      .then(answers => {
        req.quizsAnswers = answers
        return next()
      })
      .catch(err => next(err))
  }
}


module.exports = {
  getAnswersByAnswererByTag,
  getAnswersByTag,
}
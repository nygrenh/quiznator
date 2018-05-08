const QuizScore = require('app-modules/models/quiz-score')

const middlewares = {
  getAnswerersScores,
  createQuizScore
}

function getAnswerersScores(options) {
  return (req, res, next) => {
    const answererId = options.getAnswererId(req)
    const quizzes = options.getQuizzes(req)

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

    if (!answererId || !score) {
      next()
    }

    const attributes = {
      answererId,
      quizzes: {
        id: quizId,
        score,
      }
    }
    QuizScore.findOneAndUpdate(
      { answererId, quizzes: { id: quizId } },
      { $set: attributes },
      { $new: true, upsert: true }
    )
    .then(newScore => {
      req.newScore = newScore
      
      return next()
    })
    .catch(err => next(err))
  }
}

module.exports = middlewares
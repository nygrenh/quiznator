const pick = require('lodash.pick');

const QuizAnswer = require('app-modules/models/quiz-answer');

function getQuizsAnswers(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const answererId = options.getAnswererId(req);
    const sortBy = options.getSortBy(req) || 'createdAt';
    const limit = Math.min(+(options.getLimit(req)) || 50, 50);
    const skip = +(options.getSkip(req)) || 0;

    let query = { quizId };
    let sort = {};

    sort[sortBy] = -1;

    if(answererId) {
      query = Object.assign({}, query, { answererId });
    }

    QuizAnswer.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .exec()
      .then(answers => {
        req.quizsAnswers = answers;
        
        return next();
      })
      .catch(err => next(err));
  }
}

function createQuizAnswer(options) {
  return (req, res, next) => {
    const allowedAttributes = pick(options.getAttributes(req), ['data', 'confirmed']);
    const attributes = Object.assign({}, allowedAttributes, { answererId: options.getAnswererId(req), quizId: options.getQuizId(req) });

    const newQuizAnswer = new QuizAnswer(attributes);

    newQuizAnswer
      .save()
      .then(() => {
        req.newQuizAnswer = newQuizAnswer;

        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = { createQuizAnswer, getQuizsAnswers };

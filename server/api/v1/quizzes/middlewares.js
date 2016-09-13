const pick = require('lodash.pick');

const errors = require('app-modules/errors');
const Quiz = require('app-modules/models/quiz');

function getUsersQuizzes(getUserId) {
  return (req, res, next) => {

    Quiz
      .find({ userId: getUserId(req) })
      .sort({ createdAt: -1 })
      .then(quizzes => {
        req.quizzes = quizzes;

        next();
      })
      .catch(err => next(err));
  }
}

function getQuizById(getId) {
  return (req, res, next) => {
    const id = getId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz with id ${id}`))
      (Quiz.findOne({ _id: id }))
        .then(quiz => {
          req.quiz = quiz;

          return next();
        })
        .catch(err => next(err));
  }
}

function updateQuiz(options) {
  return (req, res, next) => {
    const allowedAttributes = pick(options.getAttributes(req), ['title', 'data']);

    Quiz.updateWithValidation(options.getQuery(req), allowedAttributes)
      .then(updatedQuiz => {
        req.updateQuiz = updatedQuiz;

        return next();
      })
      .catch(err => next(err));
  }
}

function createQuiz(options) {
  return (req, res, next) => {
    const userId = options.getUserId(req);

    const allowedAttributes = pick(options.getAttributes(req), ['type', 'title', 'data']);
    const attributes = Object.assign({}, allowedAttributes, { userId });

    const newQuiz = new Quiz(attributes)

    newQuiz
      .save()
      .then(() => {
        req.newQuiz = newQuiz;

        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = { getUsersQuizzes, getQuizById, createQuiz, updateQuiz };

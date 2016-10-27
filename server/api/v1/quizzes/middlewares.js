const pick = require('lodash.pick');
const Promise = require('bluebird');

const errors = require('app-modules/errors');
const Quiz = require('app-modules/models/quiz');

function getUsersQuizzes(getUserId) {
  return (req, res, next) => {
    const PAGE_SIZE = 50;
    const page = +(req.query.page || 1);

    let query = { userId: getUserId(req) };

    if(req.query.title) {
      query = Object.assign({}, query, { title: new RegExp(`^${decodeURIComponent(req.query.title)}`, 'i') });
    }

    if(req.query.types) {
      query = Object.assign({}, query, { type: { $in: req.query.types.split(',') } });
    }

    const findCount = Quiz.count(query);
    const findQuizzes = Quiz
      .find(query)
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip((page - 1) * PAGE_SIZE);

    Promise.all([findCount, findQuizzes])
      .spread((count, quizzes) => {
        req.quizzes = {
          page,
          totalPages: Math.floor(count / PAGE_SIZE) + 1,
          data: quizzes
        };

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

function getQuizStatsById(getId) {
  return (req, res, next) => {
    const id = getId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz with id ${id}`))
      (Quiz.findOne({ _id: id }))
        .then(quiz => quiz.getStats())
        .then(stats => {
          req.stats = stats;

          return next();
        })
        .catch(err => next(err));
  }
}

function updateQuiz(options) {
  return (req, res, next) => {
    const allowedAttributes = pick(options.getAttributes(req), ['title', 'data', 'body', 'expiresAt']);

    Quiz.updateWithValidation(options.getQuery(req), allowedAttributes)
      .then(updatedQuiz => {
        req.updateQuiz = updatedQuiz;

        return next();
      })
      .catch(err => next(err));
  }
}

function removeQuiz(options) {
  return (req, res, next) => {
    const id = options.getId(req);

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz with id ${id}`))
      (Quiz.findOne({ _id: id }))
        .then(quiz => {
          return quiz.remove();
        })
        .then(() => next())
        .catch(err => next(err));
  }
}

function createQuiz(options) {
  return (req, res, next) => {
    const userId = options.getUserId(req);

    const allowedAttributes = pick(options.getAttributes(req), ['type', 'title', 'data', 'expiresAt']);
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

module.exports = { getUsersQuizzes, getQuizById, getQuizStatsById, createQuiz, updateQuiz, removeQuiz };

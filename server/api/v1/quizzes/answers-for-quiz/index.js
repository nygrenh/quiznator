const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

function getDefaultSearchFilters(filters) {
  return {
    getQuizId: filters.getQuizId || (req => req.params.id),
    getAnswererId: filters.getAnswererId || (req => req.query.answererId),
    getSortBy: filters.getSortBy || (req => req.query.sortBy),
    getLimit: filters.getLimit || (req => req.query.limit),
    getSkip: filters.getSkip || (req => req.query.skip)
  }
}

router.get('/',
  authenticationMiddlewares.authorize(),
  authenticationMiddlewares.canAccessQuiz({
    getUserId: req => req.userId,
    getQuizId: req => req.params.id,
  }),
  middlewares.getQuizsAnswers(getDefaultSearchFilters({})),
  (req, res, next) => {
    res.json(req.quizsAnswers);
  });

router.get('/:answererId',
  middlewares.getQuizsAnswers({
    getQuizId: req => req.params.id,
    getAnswererId: req => req.params.answererId,
    getSortBy: req => req.query.sortBy,
    getLimit: req => req.query.limit,
    getSkip: req => req.query.skip
  }),
  (req, res, next) => {
    res.json(req.quizsAnswers);
  });

router.post('/',
  TMCMiddlewares.getProfile(),
  middlewares.createQuizAnswer({
    getAttributes: req => req.body,
    getAnswererId: req => req.TMCProfile.username,
    getQuizId: req => req.params.id
  }),
  (req, res, next) => {
    res.json(req.newQuizAnswer);
  });

module.exports = router;

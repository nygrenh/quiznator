const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');

router.use('/:id/answers', require('./answers-for-quiz'));
router.use('/:id/peer-reviews', require('./peer-reviews-for-quiz'));
router.use('/:id/peer-reviews-received', require('./peer-reviews-received-for-quiz'));

router.get('/',
  authenticationMiddlewares.authorize(),
  middlewares.getUsersQuizzes(req => req.userId),
  (req, res, next) => {
    res.json(req.quizzes);
  });

router.post('/clone',
  authenticationMiddlewares.authorize(),
  middlewares.cloneUsersQuizzes({
    getUserId: req => req.userId,
    getQuery: req => req.body
  }),
  (req, res, next) => {
    res.sendStatus(200);
  });

router.get('/:id',
  middlewares.getQuizById(req => req.params.id),
  (req, res, next) => {
    res.json(req.quiz);
  });

router.get('/:id/stats',
  middlewares.getQuizStatsById(req => req.params.id),
  (req, res, next) => {
    res.json(req.stats);
  });

router.put('/:id',
  authenticationMiddlewares.authorize(),
  authenticationMiddlewares.canAccessQuiz({
    getUserId: req => req.userId,
    getQuizId: req => req.params.id
  }),
  middlewares.updateQuiz({
    getQuery: req => ({ _id: req.params.id }),
    getAttributes: req => req.body
  }),
  (req, res, next) => {
    res.json(req.updatedQuiz);
  });

router.delete('/:id',
  authenticationMiddlewares.authorize(),
  authenticationMiddlewares.canAccessQuiz({
    getUserId: req => req.userId,
    getQuizId: req => req.params.id
  }),
  middlewares.removeQuiz({
    getId: req => req.params.id
  }),
  (req, res, next) => {
    res.sendStatus(200);
  });

router.post('/',
  authenticationMiddlewares.authorize(),
  middlewares.createQuiz({
    getUserId: req => req.userId,
    getAttributes: req => req.body
  }),
  (req, res, next) => {
    res.json(req.newQuiz);
  });

module.exports = router;

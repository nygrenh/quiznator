const router = require('express').Router();
const cors = require('cors');

const errors = require('app-modules/errors');

const errorMiddlewares = require('app-modules/middlewares/errors');

router.use('/api', cors());

router.use('/api', require('./api'));
router.use('/sign-in', require('./sign-in'));
router.use('/sign-up', require('./sign-up'));
router.use('/dashboard', require('./dashboard'));

router.get('/', (req, res, next) => res.redirect('/dashboard'));

router.use((req, res, next) => {
  next(new errors.NotFoundError(`Path "${req.path}" was not found`));
});

router.use(errorMiddlewares.oauthErrorHandler());
router.use(errorMiddlewares.apiErrorHandler());

module.exports = router;

const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/oauth', require('./oauth'));
router.use('/quizzes', require('./quizzes'));
router.use('/answerers', require('./answerers'));

module.exports = router;

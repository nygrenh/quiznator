const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/oauth', require('./oauth'));
router.use('/quizzes', require('./quizzes'));

module.exports = router;

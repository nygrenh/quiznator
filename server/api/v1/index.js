const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/oauth', require('./oauth'));
router.use('/quizzes', require('./quizzes'));
router.use('/quiz-answers', require('./quiz-answers'));
router.use('/answerers', require('./answerers'));
router.use('/tags', require('./tags'))

module.exports = router;

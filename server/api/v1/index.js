const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/oauth', require('./oauth'));
router.use('/quizzes', require('./quizzes'));
router.use('/quiz-answers', require('./quiz-answers'));
router.use('/quiz-review-answers', require('./quiz-review-answers'))
router.use('/answerers', require('./answerers'));
router.use('/tags', require('./tags'))
router.use('/quiz-scores', require('./quiz-scores'))
router.use('/course-state', require('./course-state'))

module.exports = router;

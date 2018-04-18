const _get = require('lodash/get')
const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');

router.get('/',
    middlewares.getTags({
        getUserId: req => _get(req.headers, 'userid'),
        getTags: req => req.query.tags
    }),
    (req, res, next) => {
        res.json(req.tags)
    })

router.get('/quizzes',
    authenticationMiddlewares.authorize(),
    middlewares.getQuizzesByTag({
        getUserId: req => req.userId,
        getTags: req => req.query.tags
    }),
    (req, res, next) => {
        res.json(req.quizzes)
    }
)


module.exports = router
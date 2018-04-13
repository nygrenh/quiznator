const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');

router.get('/',
    middlewares.getTags(),
    (req, res, next) => {
        res.json(req.tags)
    })

router.get('/:tag',
    middlewares.getQuizzesByTag(req => req.params.tag),
    (req, res, next) => {
        res.json(req.quizzes)
    }
)


module.exports = router
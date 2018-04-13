const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.get('/:answererId',
    // TODO: restrict access and all that
    middlewares.getAnswersByUserByTag({
        getAnswererId: req => req.params.answererId,
        getTag: req => req.query.tag
    }),
    (req, res, next) => {
        res.json(req.quizsAnswers)
    })

router.get('/',
    middlewares.getAnswersByTag({
        getTag: req => req.query.tag
    }),
    (req, res, next) => {
        res.json(req.quizsAnswers)
    }
)


module.exports = router

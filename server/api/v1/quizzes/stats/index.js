const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.get('/',
    middlewares.getStatsByTag({
        getTag: req => req.query.tag
    }),
    (req, res, next) => {
        res.json(req.stats)
    }
)

router.get('/:answererId',
    middlewares.getStatsByUserByTag({
        getAnswererId: req => req.params.answererId,
        getTag: req => req.query.tag
    }),
    (req, res, next) => {
        res.json(req.stats)
    }
)

module.exports = router

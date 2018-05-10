const router = require('express').Router({ mergeParams: true });

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.get('/user',
    TMCMiddlewares.getProfile(),
    middlewares.getAnswersByAnswererByTag({
        getAnswererId: req => req.TMCProfile.username,
        getTags: req => req.query.tags,
        getConfirmed: req => req.query.onlyConfirmed
    }), 
    (req, res, next) => {
        res.json(req.quizsAnswers)
    })

router.get('/',
    authenticationMiddlewares.authorize(),
    middlewares.getAnswersByTag({
        getTags: req => req.query.tags
    }),
    (req, res, next) => {
        res.json(req.quizsAnswers)
    }
)


module.exports = router

const router = require('express').Router();

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const middlewares = require('./middlewares');
const TMCMiddlewares = require('app-modules/middlewares/tmc');

router.get('/:date',
    TMCMiddlewares.getProfile(),
    middlewares.getData({
        getAdminStatus: req => req.TMCProfile.administrator,
        getDate: req => req.params.date
    }),
    (req, res, next) => {
        res.json(req.data);
    });

module.exports = router
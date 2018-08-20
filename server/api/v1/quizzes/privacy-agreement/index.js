const router = require('express').Router({ mergeParams: true });
const _get = require('lodash').get

const authenticationMiddlewares = require('app-modules/middlewares/authentication');
const TMCMiddlewares = require('app-modules/middlewares/tmc');
const quizanswersMiddlewares = require('../answers-for-quiz/middlewares');
const privacyAgreementMiddlewares = require('./middlewares');

// userId seems to mean answererId here, btw

router.get('/:userId',
    TMCMiddlewares.isUser(req => req.params.userId),
    privacyAgreementMiddlewares.getPrivacyAgreements({
        getQuizId: req => req.params.id,
        getUserId: req => req.params.userId
    }),
    (req, res, next) => {
        res.json(_get(req.agreements, 0));
    }
);  

router.post('/',
    TMCMiddlewares.getProfile(),
    privacyAgreementMiddlewares.savePrivacyAgreement({
        getQuizId: req => req.params.id,
        getAnswererId: req => req.TMCProfile.username,
        getStorageKey: req => _get(req.body.meta, `storageKeys[${req.params.id}]`), 
        getAttributes: req => req.body
    }),
    (req, res, next) => {
        res.json(req.agreement)
    }
);

router.get('/:userId/key/:key',
    TMCMiddlewares.isUser(req => req.params.userId),
    privacyAgreementMiddlewares.getAcceptedAgreementByKey({
        getQuizId: req => req.params.id,
        getAnswererId: req => req.params.userId,
        getStorageKey: req => req.params.key
    }),
    (req, res, next) => {
        res.json(req.agreement);
    }
)

router.get('/:userId/id/:agreementId',
    TMCMiddlewares.isUser(req => req.params.userId),
    privacyAgreementMiddlewares.getAcceptedAgreementById({
        getQuizId: req => req.params.id,
        getAnswererId: req => req.params.userId,
        getAgreementId: req => req.params.agreementId
    }),
    (req, res, next) => {
        res.json(req.agreement)
    }
)

module.exports = router;
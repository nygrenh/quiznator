const _ = require('lodash');
const Promise = require('bluebird');

const PrivacyAgreement = require('app-modules/models/privacy-agreement')
const Quiz = require('app-modules/models/quiz');

function getPrivacyAgreements(options) {
    return (req, res, next) => {
        const quizId = options.getQuizId(req);
        const answererId = options.getUserId(req)

        let query = { quizId, answererId }

        PrivacyAgreement.find(query)
            .exec()
            .then(agreements => {
                req.agreements = agreements;

                return next();
            })
            .catch(err => next(err));
    }
}

function savePrivacyAgreement(options) {
    return (req, res, next) => {
        const quizId = options.getQuizId(req);
        const answererId = options.getAnswererId(req);
        const storageKey = options.getStorageKey(req);
        const { data, meta } = options.getAttributes(req);

        const attributes = Object.assign({}, 
            options.getAttributes(req),
            { quizId, answererId, accepted: data })
        

        PrivacyAgreement.findOneAndUpdate(
            { quizId, answererId },
            { $set: attributes }, 
            { new: true, upsert: true }
        )
            .then((newAgreement) => {
                console.log('updated', newAgreement)
                req.agreement = newAgreement

                return next();
            })
            .catch(err => next(err));
    }
}

function getAcceptedAgreementByKey(options) {
    return (req, res, next) => {
        const quizId = options.getQuizId(req);
        const answererId = options.getAnswererId(req);
        const storageKey = options.getStorageKey(req);
        
        Quiz.findOne({ _id: quizId })
            .then(quiz => {
                let storageKeys = _.get(quiz, "data.meta.storageKeys")

                if (!storageKeys) {
                    return res.status(400).end();
                }

                const invertKeys = _.invert(storageKeys)
                const agreementId = _.get(invertKeys, storageKey)

                return agreementId;
            })
            .then(agreementId => {
                return PrivacyAgreement.findOne({ answererId, accepted: agreementId } )
            })
            .then(agreement => {
                if (!agreement) {
                    return res.status(400).end();
                }

                req.agreement = agreement;

                return next();
            })
            .catch(err => next(err));
    }
}

function getAcceptedAgreementById(options) {
    return (req, res, next) => {
        const quizId = options.getQuizId(req);
        const answererId = options.getAnswererId(req);
        const agreementId = options.getAgreementId(req);

        PrivacyAgreement.findOne({ answererId, accepted: agreementId })
            .then(agreement => {
                if (!agreement) {
                    return res.status(400).end()
                }

                req.agreement = agreement;
                return next();
            })
            .catch(err => next(err))
    }
}

module.exports = { 
    getPrivacyAgreements,
    savePrivacyAgreement,
    getAcceptedAgreementByKey,
    getAcceptedAgreementById
}
const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')
const mongoose = require('mongoose')
const Promise = require('bluebird')

const quizMiddlewares = require('../middlewares')

const BY_USER_BY_TAG = 'BY_USER_BY_TAG'
const BY_TAG = 'BY_TAG'

function getStats(options) {
    return (req, res, next) => {
        const answererId = options.getAnswererId ? options.getAnswererId(req) : undefined
        const userId = options.getUserId(req) || undefined
        const queryTags = (options.getTags(req) || '').split(',').filter(tag => !!tag);
        const onlyConfirmed = options.getOnlyConfirmed(req) || false

        let query = {}

        if (queryTags.length > 0) {
            query = Object.assign({}, query, { tags: { $all: queryTags } })
        }

        if (!!userId) {
            query = Object.assign({}, query, { userId })
        }

        Quiz.find(query)
            .then(quizzes => {
                let quizMap = []
                quizzes.map(quiz => {
                    quizMap[quiz.id] = quiz
                })
                switch (options.queryType) {
                    case BY_USER_BY_TAG:
                        return QuizAnswer.getStatisticsByUser(answererId, quizMap, { onlyConfirmed })
                    case BY_TAG:
                        return QuizAnswer.getStatsByTag(quizMap, { onlyConfirmed })
                    default:
                        new Error('wrong query type')
                }
            })
            .then(stats => {
                req.stats = stats
                
                return next()
            })
            .catch(err => next(err))
    }
}

function getStatsByAnswererByTag(options) {
    return getStats(Object.assign({}, options, { queryType: BY_USER_BY_TAG }))
}

function getStatsByTag(options) {
    return getStats(Object.assign({}, options, { queryType: BY_TAG }))
}

module.exports = {
    getStatsByAnswererByTag,
    getStatsByTag
}
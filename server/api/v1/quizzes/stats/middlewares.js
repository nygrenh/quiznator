const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')
const mongoose = require('mongoose')


function getStats(options) {
    return (req, res, next) => {
        const answererId = options.getAnswererId ? options.getAnswererId(req) : undefined
        const tag = options.getTag(req)

        const tags = typeof tag === 'array' ? tag : [tag]

        if (tags.length === 0) {
            return next()
        }

        Quiz
            .whereTags(tags)
            .exec()
            .then(quizzes => {
                let quizMap = []
                quizzes.map(quiz => quizMap[quiz.id] = quiz)
                switch (options.queryType) {
                    case 'BY_USER_BY_TAG':
                        return QuizAnswer.getStatisticsByUser(answererId, quizMap, {
                            onlyConfirmed: false
                        })
                    case 'BY_TAG':
                        return QuizAnswer.getStatsByTag(quizMap, {
                            onlyConfirmed: false
                        })
                    default:
                        new Error('wrong query type')
                }
            })
            .then(stats => {
                console.log(stats)

                req.stats = stats
                
                return next()
            })
            .catch(err => next(err))
    }
}

function getStatsByUserByTag(options) {
    return getStats(Object.assign({}, options, { queryType: 'BY_USER_BY_TAG' }))
/*     return (req, res, next) => {
        const answererId = options.getAnswererId(req)
        const tag = options.getTag(req)

        const tags = typeof tag === 'array' ? tag : [tag]

        if (tags.length === 0) {
            return next()
        }

        Quiz
            .whereTags(tags)
            .exec()
            .then(quizzes => {
                let quizMap = []
                quizzes.map(quiz => quizMap[quiz.id] = quiz)
                return QuizAnswer.getStatisticsByUser(answererId, quizMap, {
                    onlyConfirmed: false
                })
            })
            .then(stats => {
                console.log(stats)

                req.stats = stats
                
                return next()
            })
            .catch(err => next(err))
    }
 */
}

function getStatsByTag(options) {
    return getStats(Object.assign({}, options, { queryType: 'BY_TAG' }))
/*     return (req, res, next) => {
        const tag = options.getTag(req)

        const tags = typeof tag === 'array' ? tag : [tag]

        console.log(tags)
        if (tags.length === 0) {
            return next()
        }

        Quiz
            .whereTags(tags)
            .exec()
            .then(quizzes => {
                let quizMap = []
                quizzes.map(quiz => quizMap[quiz.id] = quiz)

                return QuizAnswer.getStatsByTag(quizMap, {
                    onlyConfirmed: false
                })
            })
            .then(stats => {
                console.log(stats)
                req.stats = stats

                return next()
            })
            .catch(err => next(err))
    } */
}

module.exports = {
    getStatsByUserByTag,
    getStatsByTag
}
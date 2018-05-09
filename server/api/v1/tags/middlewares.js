const mongoose = require('mongoose')
const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')

function getTags(options = {}) {
    return (req, res, next) => {
        const queryTags = (options.getTags(req) || '').split(',').filter(tag => !!tag);
        const userId = options.getUserId(req) || undefined

        let query = {}

        if (queryTags.length > 0) {
            query = Object.assign({}, query, { tags: { $all: queryTags} }) 
        }

        if (!!userId) {
            query = Object.assign({}, query, { userId } )
        }

        Quiz.find(query)
            .distinct('tags')
            .then(tags => {
                req.tags = tags // had: filter out given tags

                return next()
            })
            .catch(err => next(err))
    }
}

function getQuizzesByTag(options = {}) {
    return (req, res, next) => {
        const userId = options.getUserId(req) || undefined
        const queryTags = (options.getTags(req) || '').split(',').filter(tag => !!tag);

        let query = {}

        if (queryTags.length > 0) {
            query = Object.assign({}, query, { tags: { $all: queryTags} }) 
        }

        if (!!userId) {
            query = Object.assign({}, query, { userId } )
        }

        Quiz
            .find(query)
            .populate('_id')
            .then(quizzes => {
                req.quizzes = quizzes
                
                return next()
            })
            .catch(err => next(err))
    }
}

function getQuizIdsByTag(options = {}) {
    return (req, res, next) => {
        const queryTags = (options.getTags(req) || '').split(',').filter(tag => !!tag);

        if (queryTags.length == 0) {
            return next()
        }

        Quiz
            .getIdsByTags(queryTags)
            .then(quizIds => {
                req.quizIds = quizIds

                return next()
            })
            .catch(err => next(err))

/*         let query = { tags: { $all: queryTags }}
        
        Quiz
            .find(query)
            .distinct('_id')
            .then(quizIds => {
                req.quizIds = quizIds
                
                return next()
            })
            .catch(err => next(err)) */
    }
}

module.exports = {
    getTags,
    getQuizzesByTag,
    getQuizIdsByTag
}
const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')

function getTags() {
    return (req, res, next) => {
        const tags = Quiz
            .find()
            .distinct('tags')
            .then(tags => {
                req.tags = tags

                return next()
            })
            .catch(err => next(err))
    }
}

function getQuizzesByTag(getTag) {
    return (req, res, next) => {
        const query = { tags: getTag(req) }

        const quizzes = Quiz
            .find(query)
            .populate('_id')
            .then(quizzes => {
                req.quizzes = quizzes
                
                return next()
            })
            .catch(err => next(err))
    }
}


module.exports = {
    getTags,
    getQuizzesByTag,
}
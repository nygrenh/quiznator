const Quiz = require('app-modules/models/quiz')
const QuizAnswer = require('app-modules/models/quiz-answer')
const mongoose = require('mongoose')

function getAnswersByUserByTag(options) {
    return (req, res, next) => {
        /* now gets latest confirmed answers by tag(s)
          
           If it's an essay, returns also if not confirmed.
        */ 
        const answererId = options.getAnswererId(req)
        const tag = options.getTag(req)
        const onlyConfirmed = options.getConfirmed ? options.getConfirmed(req) : false

        const tags = typeof tag === 'array' ? tag : [tag]

        if (tags.length === 0) {
            return next()
        }

        Quiz
            .whereTags(tags)
            //.distinct('_id')
            .exec()
            .then(quizzes => {//quizIds => {
                let quizMap = []
                quizzes.map(quiz => quizMap[quiz.id] = quiz)
                return QuizAnswer.getLatestDistinctAnswer(answererId, quizMap, {
                    onlyConfirmed: true
                })
            })
            .then(answers => {
                req.quizsAnswers = answers

                return next()
            })
            .catch(err => next(err))
    }
}

function getAnswersByTag(options) {
    /* this doesn't do what it's supposed to */
    return (req, res, next) => {
        const tag = options.getTag(req)
        const tags = typeof tag === 'array' ? tag : [tag]

        if (tags.length === 0) {
            return next()
        }

        Quiz
            .whereTags(tags)
            .distinct('_id')
            .exec()
            .then(quizIds => {
                console.log(quizIds)
                return QuizAnswer.findDistinctlyByAnswerer({
                    quizId: { $in: quizIds.map(id => mongoose.Types.ObjectId(id)) }
                })
            })
            .then(answers => {
                console.log(answers)
                req.quizsAnswers = answers
                return next()
            })
            .catch(err => next(err))
    }
}


module.exports = {
    getAnswersByUserByTag,
    getAnswersByTag,
}
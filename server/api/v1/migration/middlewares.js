const Quiz = require('app-modules/models/quiz');
const PeerReview = require('app-modules/models/peer-review')
const QuizAnswer = require('app-modules/models/quiz-answer')
const QuizAnswerSpamFlag = require('app-modules/models/quiz-answer/quiz-answer-spam-flag')

const Promise = require('bluebird');

function getData(options) {
    return (req, res, next) => {

        if (!options.getAdminStatus(req)) {
            return Promise.reject('Unauthorized');
        }

        const date = new Date(options.getDate(req)).toISOString()

        const query = {
            $or: [
                { createdAt: { $gte: date } },
                { updatedAt: { $gte: date } },
            ]
        }
        const quizzes = Quiz.find(Object.assign(
            {
                type: {
                    $in: [
                        'ESSAY',
                        'OPEN',
                        'SCALE',
                        'CHECKBOX',
                        'MULTIPLE_OPEN',
                        'MULTIPLE_CHOICE',
                        'RADIO_MATRIX',
                        'PRIVACY_AGREEMENT',
                    ]
                }
            },
            query
        ))
        const peerReviewQuizzes = Quiz.find(Object.assign(
            {
                type: {
                    $in: ['PEER_REVIEW']
                }
            },
            query
        ))
        const peerReviews = PeerReview.find(query)
        const quizAnswers = QuizAnswer.find(query)
        const usernames = QuizAnswer.distinct('answererId', query)
        const spamFlags = QuizAnswerSpamFlag.find()

        Promise.all([quizzes, peerReviewQuizzes, peerReviews, quizAnswers, usernames, spamFlags])
            .spread((q, prq, pr, qa, un, sf) => {
                req.data = {
                    quizzes: q,
                    peerReviewQuizzes: prq,
                    peerReviews: pr,
                    quizAnswers: qa,
                    usernames: un,
                    spamFlags: sf
                }
                next();
            })
            .catch(err => next(err));
    }
}

module.exports = {
    getData
};
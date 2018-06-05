const Promise = require('bluebird');
const pick = require('lodash.pick');

const quizTypes = require('app-modules/constants/quiz-types');
const { precise_round} = require('app-modules/utils/math-utils')

const Quiz = require('app-modules/models/quiz')
const PeerReview = require('app-modules/models/peer-review')
const CourseState = require('app-modules/models/course-state')
const QuizAnswer = require('app-modules/models/quiz-answer');

const { validateAnswer } = require('app-modules/quiz-validation')

function getQuizsAnswers(options) {
  return (req, res, next) => {
    const quizId = options.getQuizId(req);
    const answererId = options.getAnswererId(req);
    const sortBy = options.getSortBy(req) || 'createdAt';
    const limit = Math.min(+(options.getLimit(req)) || 50, 50);
    const skip = +(options.getSkip(req)) || 0;

    let query = { quizId };
    let sort = {};

    sort[sortBy] = -1;

    if(answererId) {
      query = Object.assign({}, query, { answererId });
    }

    QuizAnswer.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .exec()
      .then(answers => {
        req.quizsAnswers = answers;
        
        return next();
      })
      .catch(err => next(err));
  }
}

function createQuizAnswer(options) {
  return (req, res, next) => {
    const allowedAttributes = pick(options.getAttributes(req), ['data', 'confirmed']);
    const attributes = Object.assign({}, allowedAttributes, { answererId: options.getAnswererId(req), quizId: options.getQuizId(req) });

    const newQuizAnswer = new QuizAnswer(attributes);

    newQuizAnswer
      .save()
      .then(() => {
        req.newQuizAnswer = newQuizAnswer;

        return next();
      })
      .catch(err => next(err));
  }
}

function createQuizAnswerWithValidation(options) {
  return (req, res, next) => {
    const allowedAttributes = pick(options.getAttributes(req), ['data', 'confirmed']);
    const attributes = Object.assign({}, allowedAttributes, { answererId: options.getAnswererId(req), quizId: options.getQuizId(req) });

    const quizId = attributes.quizId
    const answererId = attributes.answererId

    const newQuizAnswer = new QuizAnswer(attributes);

    newQuizAnswer
      .save()
      .then(() => {
        const getQuizzes = Quiz.findAnswerable({ _id: quizId })
        const getPeerReviewsGiven = PeerReview.find({ sourceQuizId: quizId, giverAnswererId: answererId }).exec()
        const getPeerReviewsReceived = PeerReview.find({ sourceQuizId: quizId, targetAnswererId: answererId }).exec()

        return Promise.all([getQuizzes, getPeerReviewsGiven, getPeerReviewsReceived])
          .spread((quizzes, peerReviewsGiven, peerReviewsReceived) => {
            const quiz = quizzes[0]
            
            let peerReviewsReturned = undefined

            if (quiz.type === quizTypes.ESSAY) { // and option?
              peerReviewsReturned = {
                given: peerReviewsGiven,
                received: peerReviewsReceived
              }
            }

            const validatedAnswer = validateAnswer({
              quiz,
              answer: [newQuizAnswer], // expects [0]
              peerReviews: peerReviewsReturned
            })

            const extendNewQuizAnswer = Object.assign({}, newQuizAnswer._doc, 
            {
              peerReviews: validatedAnswer.peerReviews,
              validation: validatedAnswer.validation
            })
            req.newQuizAnswer = extendNewQuizAnswer
            /*{ 
              ...newQuizAnswer._doc,
              peerReviews: validatedAnswer.peerReviews,
              validation: validatedAnswer.validation
            }*/

            return next()
          })
      })
      .catch(err => next(err));
  }

}

module.exports = { createQuizAnswer, getQuizsAnswers, createQuizAnswerWithValidation };

const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
const co = require('co');
const mongoose = require('mongoose');
const quizTypes = require('app-modules/constants/quiz-types');
const { validateAnswer, validateProgress } = require('app-modules/quiz-validation')

const Quiz = require('app-modules/models/quiz');
const QuizAnswer = require('app-modules/models/quiz-answer');
const PeerReview = require('app-modules/models/peer-review');
const CourseState = require('app-modules/models/course-state')

const { InvalidRequestError } = require('app-modules/errors');
const { precise_round } = require('app-modules/utils/math-utils')

const answerMiddlewares = require('../quizzes/answers-for-quiz/middlewares')

function getAnswerersProgress(options) {
  return (req, res, next) => {
    const getQuizzes = Quiz.findAnswerable({ _id: { $in: options.getQuizzes(req) } });
    const getQuizAnswers = QuizAnswer.find({ answererId: options.getAnswererId(req), quizId: { $in: options.getQuizzes(req) } }).distinct('quizId').exec();

    return Promise.all([getQuizzes, getQuizAnswers])
      .spread((quizzes, answers) => {
        const answerQuizIds = answers.map(id => id.toString());

        req.progress = _.groupBy(quizzes, quiz => answerQuizIds.indexOf(quiz._id.toString()) >= 0 ? 'answered' : 'notAnswered');

        return next();
      });
  }
}

function getAnswerers() {
  return (req, res, next) => {
    co(function* () {
      const { quizId, dateTo } = req.query;

      if (!quizId) {
        return Promise.reject(new InvalidRequestError('quizId is required'));
      }

      const sort = { creatAt: -1 };

      const group = { 
        _id: '$answererId', 
        id: { $first: '$_id' },
        spamFlags: { $first: '$spamFlags' }, 
        data: { $first: '$data' }, 
        peerReviewCount: { $first: '$peerReviewCount' },
        confirmed: { $first: '$confirmed' },
      };

      let match = { quizId: mongoose.Types.ObjectId(quizId) };

      if (dateTo) {
        match = Object.assign({}, match, { createdAt: { $lte: moment.utc(dateTo, 'DD-MM-YYYY').toDate() } });
      }

      const pipeline = [
        { $match: match },
        { $sort: sort },
        { $group: group },
      ];

      const answers = yield QuizAnswer.aggregate(pipeline);
      
      const peerReviews = yield PeerReview.find({ quizId });

      const peerReviewsByGiver = _.groupBy(peerReviews, peerReview => peerReview.giverAnswererId);
      const peerReviewsByReceiver = _.groupBy(peerReviews, peerReview => peerReview.targetAnswererId)

      const data = answers.map(answer => {
        return {
          answerId: answer.id,
          answererId: answer._id,
          spamFlags:  answer.spamFlags,
          data: answer.data,
          confirmed: answer.confirmed,
          receivedPeerReviews: peerReviewsByReceiver[answer._id] || [],
          givenPeerReviewsCount: (peerReviewsByGiver[answer._id] || []).length,
        };
      });

      req.answerers = data;

      return next();
    }).catch(next);
  }
}

function getProgressWithValidation(options) {
  return (req, res, next) => {
    const answererId = options.getAnswererId(req)
    if (!answererId || (!!answererId && answererId === '')) {
      return next()
    }

    const body = options.getBody(req)
    
    const quizzes = body.quizzes || true
    const answers = body.answers || false
    const peerReviews = body.peerReviews || false
    const validation = body.validation && !body.stripAnswers || false
    const stripAnswers = body.stripAnswers || false
    const peerReviewsRequiredGiven = body.peerReviewsRequiredGiven || 0
  
    let quizIds = body.quizIds
    
    const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})
    const getAnswers = answers ? QuizAnswer.find({ answererId, quizId: { $in: quizIds } }).exec() : new Promise((resolve) => resolve([]))
    const getPeerReviewsGiven = peerReviews ? PeerReview.find({ sourceQuizId: { $in: quizIds }, giverAnswererId: answererId }).exec() : new Promise((resolve) => resolve([]))
    const getPeerReviewsReceived = peerReviews ? PeerReview.find({ sourceQuizId: { $in: quizIds }, targetAnswererId: answererId }).exec() : new Promise((resolve) => resolve([]))

    let essaysAwaitingPeerReviewsGiven = []

    return Promise.all([getQuizzes, getAnswers, getPeerReviewsGiven, getPeerReviewsReceived])
      .spread((quizzes, answers, peerReviewsGiven, peerReviewsReceived) => {
        const answerQuizIds = answers.map(answer => answer.quizId.toString());
        
        const progress = _.groupBy(quizzes.map(quiz => {
          const answer = answers.filter(answer => answer.quizId.equals(quiz._id))

          let peerReviewsReturned = {}
          
          if (quiz.type === quizTypes.ESSAY && peerReviews) {
            const given = peerReviewsGiven.filter(pr => pr.sourceQuizId.equals(quiz._id))
            const received = peerReviewsReceived.filter(pr => pr.sourceQuizId.equals(quiz._id))
            
            peerReviewsReturned = {
              given,
              received
            }

            if (given.length < peerReviewsRequiredGiven && answer.length > 0)  {
              essaysAwaitingPeerReviewsGiven.push(quiz._id)
            }
          }

          let returnedQuiz

          if (stripAnswers) {
            // spread fix
            const newQuizMeta = Object.assign({}, quiz._doc.data.meta, {
              errors: undefined,
              successes: undefined,
              error: undefined,
              success: undefined,
              rightAnswer: undefined
            })
            const newQuiz = Object.assign({}, quiz._doc, 
              { data: {
                meta: docMeta
              }}
            )
            returnedQuiz = newQuiz
          } else {
            returnedQuiz = quiz
          }

          let returnObject = {
            quiz: returnedQuiz,
            answer: answers && answer.length > 0 ? answer : null,
            peerReviews: peerReviewsReturned
          } 

          return returnObject
        }), entry => answerQuizIds.indexOf(entry.quiz._id.toString()) >= 0 ? 'answered' : 'notAnswered')

        // TODO: this WILL go wonky if there's several courses
        CourseState.findOne({ answererId })
          .then(courseState => {
            let returnObject = {
              answererId,
              courseState: courseState || {},
              essaysAwaitingPeerReviewsGiven
            }

            if (validation) {
              returnObject = Object.assign({}, returnObject, validateProgress(progress))
            } else {
              returnObject = Object.assign({}, returnObject, { 
                answered: progress.answered, 
                notAnswered: progress.notAnswered, 
              })
            }

            req.validation = returnObject

            return next()
          })
        
      })
  }
}


function getUsersToBeConfirmed(quizIds) {
  return (req, res, next) => {
    const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})
    const getAnswers = QuizAnswer.find({ answererId: { $in: answererIds }, quizId: { $in: quizIds } }).exec() //: new Promise((resolve) => resolve([]))
    const getPeerReviewsGiven = PeerReview.find({ sourceQuizId: { $in: quizIds }, giverAnswererId: { $in: answererIds }}).exec() //: new Promise((resolve) => resolve([]))
    const getPeerReviewsReceived = PeerReview.find({ sourceQuizId: { $in: quizIds }, targetAnswererId: { $in: answererIds }}).exec() //: new Promise((resolve) => resolve([]))

    //...go on --- look for confirmations also
  }  
}

module.exports = { 
  getAnswerersProgress, 
  getAnswerers, 
  getProgressWithValidation,
};

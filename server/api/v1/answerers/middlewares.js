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
        rejected: { $first: '$rejected' },
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
          rejected: answer.rejected,
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
    
    const fetchQuizzes = _.get(body, 'quizzes', true)
    const fetchAnswers = _.get(body, 'answers', false)
    const fetchPeerReviews = _.get(body, 'peerReviews', false)
    const fetchValidation = _.get(body, 'validation', false)
    const onlyUpdate = _.get(body, 'onlyUpdate', false)
    const stripAnswers = _.get(body, 'stripAnswers', false)
    const peerReviewsRequiredGiven = _.get(body, 'peerReviewsRequiredGiven', 0)
    const courseId = _.get(body, 'courseId', '')

    let quizIds = body.quizIds
    
    const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})
    const getAnswers = fetchAnswers ? QuizAnswer.find({ answererId, quizId: { $in: quizIds } }).sort({ createdAt: - 1 }).exec() : new Promise((resolve) => resolve([]))
    const getPeerReviewsGiven = fetchPeerReviews ? PeerReview.find({ sourceQuizId: { $in: quizIds }, giverAnswererId: answererId }).exec() : new Promise((resolve) => resolve([]))
    const getPeerReviewsReceived = fetchPeerReviews ? PeerReview.find({ sourceQuizId: { $in: quizIds }, targetAnswererId: answererId }).exec() : new Promise((resolve) => resolve([]))

    let essaysAwaitingPeerReviewsGiven = []
    let essaysAwaitingConfirmation = []
    let rejected = []

    return Promise.all([getQuizzes, getAnswers, getPeerReviewsGiven, getPeerReviewsReceived])
      .spread((quizzes, answers, peerReviewsGiven, peerReviewsReceived) => {
        const answerQuizIds = answers.map(answer => answer.quizId.toString());
        
        const isAnswered = (quizId) => ~answerQuizIds.indexOf(quizId)

        const progress = _.groupBy(quizzes.map(quiz => {
          const answer = answers.filter(answer => answer.quizId.equals(quiz._id))
          const awaitingConfirmation = answer.length > 0 && (!answer[0].rejected && !answer[0].confirmed)

          let peerReviewsReturned = {}
          
          if (quiz.type === quizTypes.ESSAY) { 
            if (fetchPeerReviews){
              const given = peerReviewsGiven.filter(pr => pr.sourceQuizId.equals(quiz._id))
              const received = answer.length > 0 
                ? peerReviewsReceived.filter(pr => 
                    pr.sourceQuizId.equals(quiz._id) &&
                    pr.chosenQuizAnswerId.equals(answer[0]._id)) 
                : []
              
              peerReviewsReturned = {
                given,
                received
              }

              if (given.length < peerReviewsRequiredGiven && awaitingConfirmation) {
                essaysAwaitingPeerReviewsGiven.push(quiz._id)
              }
            }

            if (answer.length > 0) {
              if (answer[0].rejected) {
                rejected.push({
                  quizId: quiz._id,
                  answer: answer[0]
                })
              }
              if (awaitingConfirmation) {
                essaysAwaitingConfirmation.push(quiz._id)
              }
            }
          }

          let returnedQuiz

          if (stripAnswers && !isAnswered(quiz._id.toString())) {
            // spread fix
            // TODO: update to return right answers only
            // for answered?
            const newQuizMeta = _.omit(quiz._doc.data.meta, 
              ['errors', 
              'successes', 
              'error', 
              'success', 
              'rightAnswer', 
              'submitMessage'
              ])

            const newQuiz = Object.assign({}, quiz._doc, 
              { data: Object.assign({}, quiz._doc.data, { 
                meta: newQuizMeta
              })}
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
        }), entry => {
          return entry.answer && entry.answer[0].rejected ? 'rejected' :
                isAnswered(entry.quiz._id.toString()) ? 'answered' : 'notAnswered'
        })

        return CourseState.findOne({ answererId, courseId })
          .then(courseState => {
            let returnObject = {
              answererId,
              courseState: courseState || {},
              essaysAwaitingPeerReviewsGiven,
              essaysAwaitingConfirmation,
              rejected
            }

            if (fetchValidation) {
              returnObject = Object.assign({}, returnObject, validateProgress(progress))
              
              if (onlyUpdate) {
                returnObject.answered = _.get(returnObject, 'answered', []).map(entry => {
                  return {
                    ...entry,
                    quiz: _.pick(entry.quiz, ['_id']),
                    answer: entry.answer.map(answer => _.omit(answer, ['updatedAt', 'createdAt'])),
                    validation: undefined,
                  }
                })
                returnObject.notAnswered = _.get(returnObject, 'notAnswered', []).map(entry => ({ quiz: { _id: entry.quiz._id.toString() } }))

              }
            } else {
              returnObject = Object.assign({}, returnObject, { 
                answered: progress.answered, 
                notAnswered: progress.notAnswered, 
              })
            }

            /* 
              TODO: 
                - change to return answers as one array
                - answered/not answered/rejected as arrays of quizids (like the essay ones now)
                - update validateprogress and others that are reliant on this structure
            */
            req.validation = returnObject

            return next()
          })
          .catch(err => {
            return next(err)
          })
        
      })
      .catch(err => {
        return next(err)
      })
  }
}


module.exports = { 
  getAnswerersProgress, 
  getAnswerers, 
  getProgressWithValidation,
};

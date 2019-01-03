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
        deprecated: { $first: '$deprecated' }
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
          deprecated: answer.deprecated,
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
  return async (req, res, next) => {
    const answererId = options.getAnswererId(req)

    if (!answererId || (!!answererId && answererId === '')) {
      return next()
    }

    const body = options.getBody(req)

    const { 
      quizzes: fetchQuizzes = true,
      answers: fetchAnswers,
      peerReviews: fetchPeerReviews,
      validation: fetchValidation,
      onlyUpdate,
      stripAnswers,
      peerReviewsRequiredGiven = 0,
      courseId = '',
      quizIds: _quizIds,
    } = body

    let quizIds = _quizIds

    // if quizIds not given as parameter, get ids of quizzes with given courseId in tag AND at least one other tag 
    if (!_.get(_quizIds, 0, null) && courseId) {
      const idsByTags = await Quiz.getIdsByTags([courseId])

      quizIds = _.flatten(
        idsByTags.map(entry => 
          entry.tags.filter(t => t !== courseId).length > 0 
            ? entry.quizIds 
            : []
        )
      )
    }

    const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})
    const getAnswers = fetchAnswers ? QuizAnswer.find({ answererId, quizId: { $in: quizIds } }).sort({ createdAt: - 1 }).exec() : Promise.resolve([])
    const getPeerReviewsGiven = fetchPeerReviews ? PeerReview.find({ sourceQuizId: { $in: quizIds }, giverAnswererId: answererId }).exec() : Promise.resolve([])
    const getPeerReviewsReceived = fetchPeerReviews ? PeerReview.find({ sourceQuizId: { $in: quizIds }, targetAnswererId: answererId }).exec() : Promise.resolve([])

    return Promise.all([getQuizzes, getAnswers, getPeerReviewsGiven, getPeerReviewsReceived])
      .spread((quizzes, answers, peerReviewsGiven, peerReviewsReceived) => {
        const { 
          progress, 
          essaysAwaitingConfirmation, 
          essaysAwaitingPeerReviewsGiven,
          rejected
        } = groupProgress({
          quizzes, answers, peerReviewsGiven, peerReviewsReceived,
          peerReviewsRequiredGiven, fetchPeerReviews, stripAnswers
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

            returnObject = fetchValidation 
              ? addValidation({
                progress,
                onlyUpdate,
                returnObject
              })
              : Object.assign({}, returnObject, { 
                answered: progress.answered, 
                notAnswered: progress.notAnswered, 
              })

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

// functions used by getProgressWithValidation
function stripMeta(quiz) {
  return Object.assign({}, quiz._doc, 
    { data: Object.assign({}, quiz._doc.data, { 
      meta: _.omit(quiz._doc.data.meta, 
        ['errors', 
          'successes', 
          'error', 
          'success', 
          'rightAnswer', 
          'submitMessage'
        ])
    })}
  )
}

function addValidation({ progress, returnObject, onlyUpdate = false }) {
  let newReturnObject = Object.assign({}, returnObject, validateProgress(progress))
              
  if (onlyUpdate) {
    newReturnObject.answered = _.get(newReturnObject, 'answered', []).map(entry => {
      return {
        ...entry,
        quiz: _.pick(entry.quiz, ['_id']),
        answer: entry.answer.map(answer => _.omit(answer, ['updatedAt', 'createdAt'])),
        validation: undefined
      }
    })
    newReturnObject.notAnswered = _.get(newReturnObject, 'notAnswered', []).map(entry => ({ quiz: { _id: entry.quiz._id.toString() } }))
  }

  return newReturnObject
}

function groupProgress({
  answers,
  quizzes,
  peerReviewsGiven,
  peerReviewsReceived,
  peerReviewsRequiredGiven,
  fetchPeerReviews,
  stripAnswers,

}) {
  const answerQuizIds = answers.map(answer => answer.quizId.toString());

  const isAnswered = (quizId) => ~answerQuizIds.indexOf(quizId)
  const isConfirmed = (answer) => _.get(answer, '[0].confirmed', false)
  const isDeprecated = (answer) => _.get(answer, '[0].deprecated', false)
  const isRejected = (answer) => _.get(answer, '[0].rejected', false) 
  const isAwaitingConfirmation = (answer) => 
    !isConfirmed(answer) && !isRejected(answer) && !isDeprecated(answer)
  
  let essaysAwaitingPeerReviewsGiven = []
  let essaysAwaitingConfirmation = []
  let rejected = []
  
  const progress = _.groupBy(quizzes.map(quiz => {
    const answer = answers.filter(answer => answer.quizId.equals(quiz._id))
    const awaitingConfirmation = isAwaitingConfirmation(answer)

    let peerReviewsReturned = {}
    
    if (quiz.type === quizTypes.ESSAY && answer.length > 0) { 
      if (fetchPeerReviews && !isDeprecated(answer)) {
        const given = peerReviewsGiven.filter(pr => 
          pr.sourceQuizId.equals(quiz._id)/* &&
        pr.giverAnswererId === answererId*/)
        const received = answer.length > 0 
          ? peerReviewsReceived.filter(pr => 
            pr.sourceQuizId.equals(quiz._id) &&
              pr.chosenQuizAnswerId.equals(answer[0]._id)/* &&
          pr.targetAnswererId === answererId*/)
          : []
        
        peerReviewsReturned = {
          given,
          received
        }

        if (given.length < peerReviewsRequiredGiven && awaitingConfirmation) {
          essaysAwaitingPeerReviewsGiven.push(quiz._id)
        }
      }

      if (isRejected(answer) && !isDeprecated(answer)) {
        rejected.push({
          quizId: quiz._id,
          answer: answer[0]
        })
      }

      if (awaitingConfirmation) {
        essaysAwaitingConfirmation.push(quiz._id)
      }
    }

    const returnedQuiz = stripAnswers && !isAnswered(quiz._id.toString()) ? stripMeta(quiz) : quiz

    let returnObject = {
      quiz: returnedQuiz,
      answer: answers && answer.length > 0 ? answer : null,
      peerReviews: peerReviewsReturned
    } 

    return returnObject
  }), entry => {
    if (isRejected(entry.answer) && !isDeprecated(entry.answer)) { return 'rejected' }
    if (isAnswered(entry.quiz._id.toString()) && !isDeprecated(entry.answer)) { return 'answered' }

    return 'notAnswered'
  })

  return { progress, essaysAwaitingConfirmation, essaysAwaitingPeerReviewsGiven, rejected }  
}

module.exports = { 
  getAnswerersProgress, 
  getAnswerers, 
  getProgressWithValidation,
};

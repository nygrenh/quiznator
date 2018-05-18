const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
const co = require('co');
const mongoose = require('mongoose');
const quizTypes = require('app-modules/constants/quiz-types');

const Quiz = require('app-modules/models/quiz');
const QuizAnswer = require('app-modules/models/quiz-answer');
const PeerReview = require('app-modules/models/peer-review');
const Confirmation = require('app-modules/models/confirmation')

const { InvalidRequestError } = require('app-modules/errors');

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
    const body = options.getBody(req)
    
    const quizzes = body.quizzes || true
    const answers = body.answers || false
    const peerReviews = body.peerReviews || false
    const validation = body.validation && !body.stripAnswers || false
    const stripAnswers = body.stripAnswers || false

    let quizIds = body.quizIds
    
    const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})
    const getAnswers = answers ? QuizAnswer.find({ answererId, quizId: { $in: quizIds } }).exec() : new Promise((resolve) => resolve([]))
    const getPeerReviewsGiven = peerReviews ? PeerReview.find({ sourceQuizId: { $in: quizIds }, giverAnswererId: answererId }).exec() : new Promise((resolve) => resolve([]))
    const getPeerReviewsReceived = peerReviews ? PeerReview.find({ sourceQuizId: { $in: quizIds }, targetAnswererId: answererId }).exec() : new Promise((resolve) => resolve([]))

    return Promise.all([getQuizzes, getAnswers, getPeerReviewsGiven, getPeerReviewsReceived])
      .spread((quizzes, answers, peerReviewsGiven, peerReviewsReceived) => {
        const answerQuizIds = answers.map(answer => answer.quizId.toString());
        
        const progress = _.groupBy(quizzes.map(quiz => {
          const answer = answers.filter(answer => answer.quizId.equals(quiz._id))

          let peerReviewsReturned = undefined

          if (quiz.type === quizTypes.ESSAY && peerReviews) {
            const given = peerReviewsGiven.filter(pr => pr.sourceQuizId.equals(quiz._id))
            const received = peerReviewsReceived.filter(pr => pr.sourceQuizId.equals(quiz._id))
            
            peerReviewsReturned = {
              given,
              received
            }
          }

          let returnedQuiz

          if (stripAnswers) {
            returnedQuiz = {
              ...quiz._doc,
              data: {
                meta: {
                  ...quiz._doc.data.meta,
                  errors: undefined,
                  successes: undefined,
                  error: undefined,
                  success: undefined,
                  rightAnswer: undefined
                }
              }
            }
          } else {
            returnedQuiz = quiz
          }

          return {
            quiz: returnedQuiz,
            answer: answers && answer.length > 0 ? answer : null,
            peerReviews: peerReviewsReturned
          } 
        }), entry => answerQuizIds.indexOf(entry.quiz._id.toString()) >= 0 ? 'answered' : 'notAnswered')

        // or some better method
        Confirmation.findOne({ answererId })
          .then(confirmation => {
            if (validation) {
              req.validation = { ...validate(progress), answererId, confirmation: confirmation || {} }
            } else {
              req.validation = { answered: progress.answered, notAnswered: progress.notAnswered, answererId, confirmation: confirmation || {} }
            }

            return next()
          })
        
      })
  }
}


function validate(progress) {
  let totalPoints = 0
  let totalMaxPoints = 0
  let totalNormalizedPoints = 0

  let answered = []
  let notAnswered = []

  progress.answered && progress.answered.forEach(entry => {
    const { quiz, answer, peerReviews } = entry

    let points = 0
    let normalizedPoints = 0

    const { regex, multi, rightAnswer } = quiz.data.meta
    const { items, choices } = quiz.data 

    const maxPoints = Math.max(items ? items.length : 0, 1)
    
    const { data } = answer[0]

    switch (quiz.type) {
      case quizTypes.ESSAY:
        points = answer.confirmed ? 1 : 0
        normalizedPoints = points
        break
      case quizTypes.RADIO_MATRIX:
        points = multi
          ? (items.map(item => 
            data[item.id].map(k => rightAnswer[item.id].indexOf(k) >= 0).every(v => !!v)
            && rightAnswer[item.id].map(k => data[item.id].indexOf(k) >= 0).every(v => !!v)
          ).filter(v => v).length)
          : (items.map(item => 
            rightAnswer[item.id].indexOf(data[item.id]) >= 0
          ).filter(v => v).length)
        normalizedPoints = points / maxPoints
        break
      case quizTypes.MULTIPLE_CHOICE:
        points = rightAnswer.some(o => o === data) ? 1 : 0
        normalizedPoints = points
        break
      case quizTypes.OPEN:
        if (regex) {
          try {
            let re = new RegExp(rightAnswer)
            points = !!re.exec(data.trim().toLowerCase()) ? 1 : 0
          } catch(err) {
            return 0
          }
        } else {
          points = data.trim().toLowerCase() === rightAnswer.trim().toLowerCase() ? 1 : 0
        }
        normalizedPoints = points
        break
      case quizTypes.MULTIPLE_OPEN:
        if (regex) {
          points = items.map(item => {
            try {
              let re = new RegExp(rightAnswer[item.id])
              return !!re.exec(data[item.id].trim().toLowerCase())
            } catch(err) {
              return false
            }
          }).filter(v => v).length              
        } else {
          points = items.map(item => 
            data[item.id].trim().toLowerCase() === rightAnswer[item.id].trim().toLowerCase()
          ).filter(v => v).length
        }
        normalizedPoints = points / maxPoints
        break
      default:
        break
    }

    totalPoints += points
    totalMaxPoints += maxPoints
    totalNormalizedPoints += normalizedPoints

    answered.push({
          quiz,
          answer,
          peerReviews,
          validation: {
            points,
            maxPoints,
            normalizedPoints: precise_round(normalizedPoints, 2)
          }
        })
  })
  
  progress.notAnswered && progress.notAnswered.map(entry => {
    const { quiz, peerReviews } = entry
    const { items } = quiz.data

    const maxPoints = Math.max(items ? items.length : 0, 1)
        
    totalMaxPoints += maxPoints

    notAnswered.push({
      quiz,
      peerReviews,
      validation: {
        maxPoints
      }
    })
  })

  const maxNormalizedPoints = (progress.answered || []).length + (progress.notAnswered || []).length 
  const confirmedAmount = (progress.answered || []).filter(entry => entry.answer[0].confirmed).length

  const progressWithValidation = {
    answered,
    notAnswered,
    validation: {
      points: totalPoints,
      maxPoints: totalMaxPoints,
      confirmedAmount,
      normalizedPoints: precise_round(totalNormalizedPoints, 2),
      maxNormalizedPoints,
      progress: precise_round(confirmedAmount / maxNormalizedPoints * 100, 2),
    }
  }

  return progressWithValidation
}

function precise_round(num,decimals) {
  var sign = num >= 0 ? 1 : -1;
  return parseFloat((Math.round((num*Math.pow(10,decimals)) + (sign*0.001)) / Math.pow(10,decimals)).toFixed(decimals));
}

module.exports = { getAnswerersProgress, getAnswerers, getProgressWithValidation };

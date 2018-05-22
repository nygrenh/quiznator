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
const { precise_round} = require('app-modules/utils/math-utils')

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
/*             returnedQuiz = {
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
            } */
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
              req.validation = { ...validateProgress(progress), answererId, confirmation: confirmation || {} }
            } else {
              req.validation = { answered: progress.answered, notAnswered: progress.notAnswered, answererId, confirmation: confirmation || {} }
            }

            return next()
          })
        
      })
  }
}

function validateProgress(progress) {
  let totalPoints = 0
  let totalMaxPoints = 0
  let totalCompletedMaxPoints = 0
  let totalNormalizedPoints = 0

  let answered = []
  let notAnswered = []

  progress.answered && progress.answered.forEach(entry => {
    const validatedAnswer = answerMiddlewares.validateAnswer(entry)

    totalPoints += validatedAnswer.validation.points
    totalMaxPoints += validatedAnswer.validation.maxPoints
    totalCompletedMaxPoints += validatedAnswer.validation.maxPoints
    totalNormalizedPoints += validatedAnswer.validation.normalizedPoints

    answered.push(validatedAnswer)
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
  const maxCompletedNormalizedPoints = (progress.answered || []).length
  const confirmedAmount = (progress.answered || []).filter(entry => entry.answer[0].confirmed).length

  const progressWithValidation = {
    answered,
    notAnswered,
    validation: {
      points: totalPoints,
      maxPoints: totalMaxPoints,
      maxCompletedPoints: totalCompletedMaxPoints,
      confirmedAmount,
      normalizedPoints: precise_round(totalNormalizedPoints, 2),
      maxNormalizedPoints,
      maxCompletedNormalizedPoints,
      progress: precise_round(confirmedAmount / maxNormalizedPoints * 100, 2),
    }
  }

  return progressWithValidation
}

function confirmEssays(options) {
  return (req, res, next) => {
    const quizIds = options.getQuizIds(req)
    // const answererIds = options.getAnswererIds(req)

    if (quizIds.length === 0) { //} || answererIds.length === 0) {
      return next(new Error('no quizids'))
    }

    const getQuizzes = Quiz.findAnswerable({ _id: { $in: quizIds }})
      
    return getQuizzes
      .then(quizzes => quizzes.filter(quiz => quiz.type === quizTypes.ESSAY))
      .then(essays => {
        const essayIds = essays.map(quiz => quiz._id)

        const getAnswers = QuizAnswer.find({
          //{ answererId: { $in: answererIds }, 
          quizId: { $in: essayIds } 
        }).exec() //: new Promise((resolve) => resolve([]))
        const getPeerReviewsGiven = PeerReview.find({ 
          sourceQuizId: { $in: essayIds }, 
          //giverAnswererId: { $in: answererIds }
        }).exec() //: new Promise((resolve) => resolve([]))
        const getPeerReviewsReceived = PeerReview.find({ 
          sourceQuizId: { $in: essayIds }, 
          //targetAnswererId: { $in: answererIds }
        }).exec() //: new Promise((resolve) => resolve([]))
    
        return Promise.all([getAnswers, getPeerReviewsGiven, getPeerReviewsReceived])
          .spread((answers, peerReviewsGiven, peerReviewsReceived) => {
            const answerQuizIds = answers.map(answer => answer.quizId.toString());
            const answererIds = _.uniq(answers.map(answer => answer.answererId))

            const passedEssays = _.groupBy(answererIds.map(answererId => {
              const essaysForAnswerer = { answererId, essays: _.groupBy(essays.map(quiz => {
                const answerArray = answers.filter(answer => 
                  answer.quizId.equals(quiz._id) && answer.answererId === answererId
                )

                if (!answerArray || (!!answerArray && answerArray.length === 0)) {
                  return
                }

                const answer = answerArray[0]


                const given = peerReviewsGiven.filter(pr => {
                  return pr.sourceQuizId.equals(quiz._id) && pr.giverAnswererId === answererId
                })
                const received = peerReviewsReceived.filter(pr => {
                  return pr.sourceQuizId.equals(quiz._id) && pr.targetAnswererId === answererId
                })

/*                 if (given.length < 2 || received.length < 2) {
                  console.log('too few peer reviews: ', answer)
                  return
                } */

                const averageGrade = 
                  _.mean(received.map(review => _.sum(Object.values(review.grading))))

                const spamFlags = answer.spamFlags

                const pass = given.length >= 2 && 
                            (received.length >= 5 && averageGrade >= 12)
                            && spamFlags < 2
                const fail = (received.length >= 5 && averageGrade < 10)
                            || spamFlags >= 5

                const reviewObject = {
                  answererId,
                  quizId: quiz._id,
                  answer: answer,
                  givenCount: given.length,
                  receivedCount: received.length,
                  spamFlags: answer.spamFlags,
                  averageGrade,
                  pass,
                  fail
                }

                return reviewObject

              }).filter(v => !!v), entry => 
                  entry.pass ? 'pass'
                : (entry.fail ? 'fail' : 'review')) } // groupBy

              console.log('essays for answerer', essaysForAnswerer)

              return essaysForAnswerer
            }), essays => essays.answererId) // groupBy

            req.passedEssays = passedEssays

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
  confirmEssays 
};

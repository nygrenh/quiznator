const Promise = require('bluebird');
const pick = require('lodash.pick');

const quizTypes = require('app-modules/constants/quiz-types');
const { precise_round} = require('app-modules/utils/math-utils')

const Quiz = require('app-modules/models/quiz')
const PeerReview = require('app-modules/models/peer-review')
const Confirmation = require('app-modules/models/confirmation')
const QuizAnswer = require('app-modules/models/quiz-answer');

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

        Promise.all([getQuizzes, getPeerReviewsGiven, getPeerReviewsReceived])
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

            req.newQuizAnswer = { 
              ...newQuizAnswer._doc,
              peerReviews: validatedAnswer.peerReviews,
              validation: validatedAnswer.validation
            }

            return next()
          })
      })
      .catch(err => next(err));
  }

}

function validateAnswer(data) {
  // TODO: some checking
  const { quiz, answer, peerReviews } = data
  const answerData = answer[0].data
  const { regex, multi, rightAnswer } = quiz.data.meta
  const { items, choices } = quiz.data 

  let points = 0
  let normalizedPoints = 0

  const maxPoints = Math.max(items ? items.length : 0, 1)

  switch (quiz.type) {
    case quizTypes.ESSAY:
      points = answer.confirmed ? 1 : 0
      normalizedPoints = points
      break
    case quizTypes.RADIO_MATRIX:
      points = multi
        ? (items.map(item => 
          answerData[item.id].map(k => rightAnswer[item.id].indexOf(k) >= 0).every(v => !!v)
          && rightAnswer[item.id].map(k => answerData[item.id].indexOf(k) >= 0).every(v => !!v)
        ).filter(v => v).length)
        : (items.map(item => 
          rightAnswer[item.id].indexOf(answerData[item.id]) >= 0
        ).filter(v => v).length)
      normalizedPoints = points / maxPoints
      break
    case quizTypes.MULTIPLE_CHOICE:
      points = rightAnswer.some(o => o === answerData) ? 1 : 0
      normalizedPoints = points
      break
    case quizTypes.OPEN:
      if (regex) {
        try {
          let re = new RegExp(rightAnswer)
          points = !!re.exec(answerData.trim().toLowerCase()) ? 1 : 0
        } catch(err) {
          // points 0
        }
      } else {
        points = answerData.trim().toLowerCase() === rightAnswer.trim().toLowerCase() ? 1 : 0
      }
      normalizedPoints = points
      break
    case quizTypes.MULTIPLE_OPEN:
      if (regex) {
        points = items.map(item => {
          try {
            let re = new RegExp(rightAnswer[item.id])
            return !!re.exec(answerData[item.id].trim().toLowerCase())
          } catch(err) {
            return false
          }
        }).filter(v => v).length              
      } else {
        points = items.map(item => 
          answerData[item.id].trim().toLowerCase() === rightAnswer[item.id].trim().toLowerCase()
        ).filter(v => v).length
      }
      normalizedPoints = points / maxPoints
      break
    default:
      break
  }

  const returnObject = {
    quiz,
    answer,
    peerReviews,
    validation: {
      points,
      maxPoints,
      normalizedPoints: precise_round(normalizedPoints, 2)
    }
  }  

  return returnObject
}

module.exports = { createQuizAnswer, getQuizsAnswers, createQuizAnswerWithValidation, validateAnswer };

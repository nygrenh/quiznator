const Promise = require('bluebird');

const mongoose = require('mongoose');
const _ = require('lodash')
const errors = require('app-modules/errors');

const QuizAnswer = require('app-modules/models/quiz-answer')

module.exports = schema => {
  schema.statics.findPeerReviewsForAnswerer = function (options) {
    // find peer reviews for given quiz and given answerer as giver
    return this.find({
      quizId: options.quizId,
      giverAnswererId: options.answererId
    }, {
        _id: 0,
        chosenQuizAnswerId: 1
      })
      // return chosen quiz answerids
      // map received answerids to objectid
      .then(reviews => reviews.map(review => mongoose.Types.ObjectId(review.chosenQuizAnswerId.toString())))
      .then(chosenQuizAnswerIds => {
        // query for given quizid, NOT current answererid and NOT IN already reviewed ids
        const query = {
          quizId: mongoose.Types.ObjectId(options.quizId.toString()),
          answererId: { $ne: options.answererId },
          _id: { $nin: chosenQuizAnswerIds },
          /*           rejected: false,
          confirmed: false */
        };

        // get limit + 20 quiz answers by query, sorted by peer review count ascending
        return mongoose.models.QuizAnswer.findDistinctlyByAnswerer(query,
          {
            limit: options.limit + 20,
            skip: options.skip,
            sort: { peerReviewCount: 1 }
          })
          .then(reviews => _.sampleSize(reviews, options.limit));

        // TODO: get reviewable from those from required -1 
      });
  }

  schema.statics.findPeerReviewsForAnswererv2 = function (options) {
    const {
      answererId,
      quizId,
      limit = 2,
      skip = 0,
      minimumPeerReviews = 2,
      maxSpam = 2,
      poolSize = 20
    } = options

    return this.find({
      quizId: quizId,
      giverAnswererId: answererId,
    }, {
        _id: 0,
        chosenQuizAnswerId: 1
      })
      // return chosen quiz answerids
      // map received answerids to objectid
      .then(reviews => reviews.map(review => mongoose.Types.ObjectId(review.chosenQuizAnswerId.toString())))
      .then(chosenQuizAnswerIds => {

        const basicQuery = {
          quizId: mongoose.Types.ObjectId(quizId.toString()),
          answererId: { $ne: answererId },
          spamFlags: { $lte: maxSpam },
          _id: { $nin: chosenQuizAnswerIds },
        }

        const belowAnswers = QuizAnswer.findDistinctlyByAnswerer(
          Object.assign({}, basicQuery, {
            confirmed: false,
            rejected: false,
            deprecated: { $ne: true }, // TODO: set to false when db updated to have this field on every answer
            peerReviewCount: { $lt: minimumPeerReviews },
          }), {
            sort: { peerReviewCount: -1 }, // createdAt: 1
            limit: limit + poolSize,
            skip: skip,
            filterDuplicates: true
          })
        const aboveAnswers = QuizAnswer.findDistinctlyByAnswerer(
          Object.assign({}, basicQuery, {
            peerReviewCount: { $gte: minimumPeerReviews },
            rejected: false,
            deprecated: { $ne: true }, // TODO: ditto
          }), {
            sort: { peerReviewCount: 1 }, // createdAt: 1
            limit: limit + poolSize,
            skip: skip,
            //filterDuplicates: true 
            // if we're out of unconfirmed/rejected, let's just give non-rejected above the limit
          })

        return Promise.all([belowAnswers, aboveAnswers])
          .spread((belowReviews, aboveReviews) => {
            let reviews = belowReviews
            if (reviews.length < limit) {
              reviews = reviews.concat(aboveReviews)
            }

            /*             console.log(reviews.map(r => ({ id: r._id, peerReviewCount: r.peerReviewCount }))) */

            return _.sampleSize(reviews, limit)
          })
      })
  }

  schema.statics.findPeerReviewsForAnswererv3 = async function (options) {
    const {
      answererId,
      quizId,
      limit = 2,
      skip = 0,
      minimumGivenPeerReviews = 3,
      minimumReceivedPeerReviews = 2,
      maxSpam = 2,
      poolSize = 20,
      quizIdSwapped = false
    } = options

    // get peer reviews per answerer, sorted by given reviews
    const peerReviewsPerAnswerer = await this.aggregate([
      quizIdSwapped
        ? { $match: { sourceQuizId: mongoose.Types.ObjectId(quizId) } }
        : { $match: { quizId: mongoose.Types.ObjectId(quizId) } },
      { $match: { giverAnswererId: { $ne: answererId } } },
      {
        $group: {
          _id: '$giverAnswererId',
          answerIds: { $addToSet: '$chosenQuizAnswerId' },
          reviews: { $sum: 1 }
        }
      },
      { $sort: { reviews: -1 } },
    ])
      .exec()


    const chosenQuizAnswerIds = await this.aggregate([
      quizIdSwapped
        ? { $match: { sourceQuizId: mongoose.Types.ObjectId(quizId) } }
        : { $match: { quizId: mongoose.Types.ObjectId(quizId) } },
      { $match: { giverAnswererId: answererId } },
      { $project: { chosenQuizAnswerId: 1 } }
    ])
      .exec()
      .map(quiz => mongoose.Types.ObjectId(quiz.chosenQuizAnswerId.toString()))

    //const chosenQuizAnswerIds = _.get(peerReviewsPerAnswerer.filter(entry => entry._id === answererId), '[0].answerIds', [])
    //  .map(id => mongoose.Types.ObjectId(id))

    const peerReviewAnswererIds = peerReviewsPerAnswerer
      .map(entry => entry._id)
    // .filter(id => id !== answererId)

    // get answers with not enough peer reviews, not spam and not already peer reviewed by this answerer 
    // added: do not get deprecated answers
    const query = {
      _id: { $nin: chosenQuizAnswerIds },
      quizId: mongoose.Types.ObjectId(quizId.toString()),
      answererId: { $in: peerReviewAnswererIds },
      deprecated: { $ne: true },
      spamFlags: { $lte: maxSpam },
      peerReviewCount: { $lt: minimumReceivedPeerReviews }
    }

    const answers = await QuizAnswer.findDistinctlyByAnswerer(query, {
      sort: { peerReviewCount: -1 },
      //filterDuplicates: true
    })

    const answersPerAnswerer = _.groupBy(answers, 'answererId')
    const answererIds = Object.keys(answersPerAnswerer)

    let reviews = []

    peerReviewsPerAnswerer.some(entry => {
      if (_.includes(answererIds, entry._id) && entry.reviews >= minimumGivenPeerReviews) {
        reviews.push(answersPerAnswerer[entry._id][0])
      }

      return reviews.length >= limit + poolSize
    })

    if (reviews.length < limit) {
      return this.findPeerReviewsForAnswerer(options)
    }

    return Promise.resolve(_.sampleSize(reviews, limit))
  }

  schema.statics.findPeerReviewsGivenToAnswerer = function (options) {
    const query = {
      quizId: options.quizId,
      targetAnswererId: options.answererId
    }

    return this.find(query)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .exec();
  }

  schema.pre('save', function (next) {
    mongoose.models.QuizAnswer.update({ _id: this.chosenQuizAnswerId }, { $inc: { peerReviewCount: 1 } })
      .then(() => next())
      .catch(next);
  });

  schema.pre('validate', function (next) {
    if (!this.chosenQuizAnswerId) {
      return next();
    }

    errors.withExistsOrError(new errors.NotFoundError(`Couldn't find quiz answer with id ${this.chosenQuizAnswerId}`))
      (mongoose.models.QuizAnswer.findOne({ _id: this.chosenQuizAnswerId }))
      .then(chosenAnswer => {
        this.targetAnswererId = chosenAnswer.answererId;

        next();
      })
      .catch(next);
  });
}

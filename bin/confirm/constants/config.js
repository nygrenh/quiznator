const config = {
  API_URI: `${process.env.API_URI}/api/v1`
  DB_URI: process.env.MONGO_URI, //'mongodb://127.0.0.1:27017/test'
  MINIMUM_PEER_REVIEWS_GIVEN: 3,
  MINIMUM_PEER_REVIEWS_RECEIVED: 3,
  MINIMUM_SPAM_FLAGS_TO_FAIL: 3,
  MAXIMUM_SPAM_FLAGS_TO_PASS: 0,
  MINIMUM_PROGRESS_TO_PASS: 90,
  MINIMUM_SCORE_TO_PASS: 50,
  MAXIMUM_SADFACE_PERCENTAGE: 35,
  GRADE_CUTOFF_POINT: 0.6,
  COURSE_ID: 'elements-of-ai',
  COURSE_SHORT_ID: 'ai',
  PARTS: 6,
  SECTIONS_PER_PART: 3,
  IGNORE_LIST: [
    '5aec479606ee0000047c5967', // ex 3
    '5aec60b006ee0000047c599a', // 20
    '5aec5e7c06ee0000047c5995', // 8
    '5aec626406ee0000047c599e' // 17
  ]
}

const rejectReasons = {
  FLAGGED_AS_SPAM: 'Your answer was flagged as spam.',
  TOO_MANY_SADFACES: 'Your answer received too many negative peer reviews.'
}

module.exports = { config, rejectReasons }
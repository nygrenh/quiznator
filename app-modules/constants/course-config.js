const config = {
  API_URI: process.env.API_URL, // 'http://127.0.0.1:3000', // 'http://quiznator.herokuapp.com', // process.env.API_URI
  DB_URI: process.env.MONGO_URI, //'mongodb://127.0.0.1:27017/test'
  MINIMUM_PEER_REVIEWS_GIVEN: 3,
  MINIMUM_PEER_REVIEWS_RECEIVED: 2,
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
    //'5aec5e7c06ee0000047c5995', // 8
    '5aec626406ee0000047c599e', // 17 
    '5aec60b006ee0000047c599a', // 20
  ]
}

const reasons = {
  REJECT_FLAGGED_AS_SPAM: 'REJECT_FLAGGED_AS_SPAM',
  REJECT_TOO_MANY_SADFACES: 'REJECT_TOO_MANY_SADFACES'
}

module.exports = { config, reasons }
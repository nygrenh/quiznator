require('dotenv').config({ silent: true });

const fetchPonyfill = require('fetch-ponyfill')
const { fetch } = fetchPonyfill()
const { config } = require('../../constants/config')
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise

const API_URI = config.API_URI

function connect() {
  mongoose.connect(config.DB_URI, {
    useMongoClient: true
  })
  
  var db = mongoose.connection
  
  db.on('error', err => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
  })

  return db
}

function fetchQuizIds(courseId) { 
  return new Promise((resolve, reject) => {
    let quizIds = []

    fetch(`${API_URI}/api/v1/tags/quizids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tags: [courseId] })
    })
      .then(res => res.json())
      .then(tagData => {
        tagData.forEach(data => {
          // only count quiz if attached to part/section
          if (~data.tags.indexOf(courseId) && data.tags.length > 1) {
            data.quizIds.forEach(quizId => quizIds.push(quizId))
          }
        })

        resolve(quizIds)
      })
      .catch(err => (console.error(err), reject(new Error(err))))
  })
}

module.exports = { connect, fetchQuizIds }

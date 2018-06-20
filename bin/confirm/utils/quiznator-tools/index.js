require('dotenv').config({ silent: true });

const fetchPonyfill = require('fetch-ponyfill')
const { fetch } = fetchPonyfill()
const { config } = require('app-modules/constants/course-config')

const API_URI = config.API_URI

function fetchQuizIds(tags) { 
  return new Promise((resolve, reject) => {
    let quizIds = []

    fetch(`${API_URI}/api/v1/tags/quizids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tags })
    }).then(res => {
      res.json()
        .then(tagData => {
          tagData.forEach(data => {
            if (~data.tags.indexOf(config.COURSE_ID)) {
              data.quizIds.forEach(quizId => quizIds.push(quizId))
            }
          })
          resolve(quizIds)
        })
    }).catch(err => reject(new Error(err)))
  })
}

module.exports = { fetchQuizIds }

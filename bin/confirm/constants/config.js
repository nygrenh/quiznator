const config = {
  API_URI: process.env.API_URL, // 'http://127.0.0.1:3000', // 'http://quiznator.herokuapp.com', // process.env.API_URI
  DB_URI: process.env.MONGO_URI, //'mongodb://127.0.0.1:27017/test'
}

module.exports = { config }
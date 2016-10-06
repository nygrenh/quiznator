const gulp = require('gulp');
const mocha = require('gulp-mocha');

const constants = require('./constants');

module.exports = () => {
  process.env = Object.assign({}, process.env, constants.ENV_CONFIG, {
    MONGO_URI_TEST: 'mongodb://localhost/quiznator-test'
  });

  gulp.src('./server/**/spec.js', { read: false })
    .pipe(mocha())
    .once('end', () => {
      process.exit();
    });
}

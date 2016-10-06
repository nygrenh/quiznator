const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const constants = require('./constants');

let quiznatorClient = {};

module.exports = () => {
  nodemon({
    script: './bin/www',
    ext: 'js',
    watch: constants.NODEMON_PATHS,
    env: constants.ENV_CONFIG
  });
};

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const constants = require('./constants');

let quiznatorClient = {};

module.exports = () => {
  nodemon({
    script: './bin/www',
    ext: 'js',
    watch: constants.NODEMON_PATHS,
    env: {
      NODE_ENV: 'development',
      MONGO_URI: 'mongodb://localhost/quiznator',
      PLUGIN_SCRIPT_URL: 'http://localhost:3000/javascripts/plugin.min.js',
      PLUGIN_STYLE_URL: 'http://localhost:3000/stylesheets/plugin.min.css',
      TMC_URL: 'https://tmc.mooc.fi',
      QUIZNATOR_CLIENT_ID: 'quiznatorApp',
      QUIZNATOR_CLIENT_SECRET: 'quiznatorSecret'
    }
  });
};

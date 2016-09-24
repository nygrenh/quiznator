const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const constants = require('./constants');

const { TMC_CLIENT_ID, TMC_CLIENT_SECRET } = require('tmc-client.config.js');
const { QUIZNATOR_CLIENT_ID, QUIZNATOR_CLIENT_SECRET } = require('quiznator-client.config.js');

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
      TMC_CLIENT_ID,
      TMC_CLIENT_SECRET,
      QUIZNATOR_CLIENT_ID,
      QUIZNATOR_CLIENT_SECRET
    }
  });
};

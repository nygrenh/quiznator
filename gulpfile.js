require('app-module-path').addPath(__dirname);

require('dotenv').config(__dirname, '../', {  silent: true });

const gulp = require('gulp');
const path = require('path');
const _ = require('lodash');

const makeNodemonTask = require('gulp-tasks/nodemon-task');
const makeAssetTask = require('gulp-tasks/assets-task');
const makeScripTask = require('gulp-tasks/script-task');
const makeWebpackConfig = require('gulp-tasks/webpack-config');
const makeSassTask = require('gulp-tasks/sass-task');
const makeMochaTask = require('gulp-tasks/mocha-task');

const scriptsDist = path.join(__dirname, 'dist', 'javascripts');
const stylesDist = path.join(__dirname, 'dist', 'stylesheets');
const clientCommonModules = path.join(__dirname, 'client', 'common');

const isDevelopment = process.env.NODE_ENV === 'development';

gulp.task('nodemon', makeNodemonTask({
  watch: ['./app-modules', './server']
}));

gulp.task('assets', makeAssetTask({
  entries: ['./assets/**/*'],
  output: path.join(__dirname, 'dist', 'assets')
}));

gulp.task('scripts.dashboard', makeScripTask({
  webpackConfig: makeWebpackConfig({
    entry: path.join(__dirname, 'client', 'dashboard', 'index.js'),
    output: scriptsDist,
    fileName: 'dashboard',
    modules: [clientCommonModules, path.join(__dirname, 'client', 'dashboard')],
    env: {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.API_URL
    },
    isDevelopment,
  }),
  isDevelopment
}));

gulp.task('styles.dashboard', makeSassTask({
  entry: path.join(__dirname, 'client', 'dashboard', 'index.scss'),
  fileName: 'dashboard',
  output: stylesDist,
  isDevelopment
}));

gulp.task('styles.dashboard:watch', ['styles.dashboard'], () => {
  gulp.watch(['./client/dashboard/**/*.scss'], ['styles.dashboard']);
});

gulp.task('scripts.plugin', makeScripTask({
  webpackConfig: makeWebpackConfig({
    entry: path.join(__dirname, 'client', 'plugin', 'index.js'),
    output: scriptsDist,
    fileName: 'plugin',
    modules: [clientCommonModules, path.join(__dirname, 'client', 'plugin')],
    env: {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.API_URL
    },
    isDevelopment,
  }),
  isDevelopment
}));

gulp.task('styles.plugin', makeSassTask({
  entry: path.join(__dirname, 'client', 'plugin', 'index.scss'),
  fileName: 'plugin',
  output: stylesDist,
  classPrefix: 'quiznator-',
  isDevelopment
}));

gulp.task('styles.plugin:watch', ['styles.dashboard'], () => {
  gulp.watch(['./client/plugin/**/*.scss'], ['styles.plugin']);
});

gulp.task('scripts.signIn', makeScripTask({
  webpackConfig: makeWebpackConfig({
    entry: path.join(__dirname, 'client', 'sign-in', 'index.js'),
    output: scriptsDist,
    fileName: 'sign-in',
    modules: [clientCommonModules, path.join(__dirname, 'client', 'sign-in')],
    env: {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.API_URL
    },
    isDevelopment,
  }),
  isDevelopment
}));

gulp.task('styles.signIn', makeSassTask({
  entry: path.join(__dirname, 'client', 'sign-in', 'index.scss'),
  fileName: 'sign-in',
  output: stylesDist,
  isDevelopment
}));

gulp.task('scripts.signUp', makeScripTask({
  webpackConfig: makeWebpackConfig({
    entry: path.join(__dirname, 'client', 'sign-up', 'index.js'),
    output: scriptsDist,
    fileName: 'sign-up',
    modules: [clientCommonModules, path.join(__dirname, 'client', 'sign-up')],
    env: {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.API_URL
    },
    isDevelopment,
  }),
  isDevelopment
}));

gulp.task('styles.signUp', makeSassTask({
  entry: path.join(__dirname, 'client', 'sign-up', 'index.scss'),
  fileName: 'sign-up',
  output: stylesDist,
  isDevelopment
}));

gulp.task('scripts.pluginLoader', makeScripTask({
  webpackConfig: makeWebpackConfig({
    entry: path.join(__dirname, 'client', 'plugin-loader', 'index.js'),
    output: scriptsDist,
    fileName: 'plugin-loader',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PLUGIN_SCRIPT_URL: process.env.PLUGIN_SCRIPT_URL,
      PLUGIN_STYLE_URL: process.env.PLUGIN_STYLE_URL
    },
    isDevelopment,
  }),
  isDevelopment
}));

gulp.task('tests.server', makeMochaTask({
  entries: ['./app-modules/**/__tests__/*.js', './server/**/__tests__/*.js']
}));

gulp.task('build', [
  'assets',
  'scripts.dashboard',
  'scripts.plugin',
  'scripts.pluginLoader',
  'scripts.signIn',
  'scripts.signUp',
  'styles.dashboard',
  'styles.plugin',
  'styles.signIn',
  'styles.signUp'
]);

gulp.task('default', ['nodemon', 'scripts.dashboard', 'styles.dashboard:watch']);

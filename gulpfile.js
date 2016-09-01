require('app-module-path').addPath(__dirname);

const gulp = require('gulp');
const path = require('path');

const buildBundleTasks = require('gulp-tasks/helpers/build-bundle-tasks');

const DEST_SCRIPTS = path.resolve('./dist/javascripts');
const DEST_STYLESHEETS = path.resolve('./dist/stylsheets');

gulp.task('server', require('./gulp-tasks/server'));

gulp.task('build', ['move-assets'], () => {});

gulp.task('deploy', require('gulp-tasks/deploy')());

gulp.task('serve', ['serve.clientApp', 'serve.pluginApp'], () => {});

gulp.task('move-assets', require('gulp-tasks/move-assets'));

buildBundleTasks({
  name: 'clientApp',
  scripts: {
    react: true,
    entry: path.resolve('./client/index.js'),
    modulesDirectories: [path.resolve('./client')],
    output: DEST_SCRIPTS,
    fileName: 'client.min.js'
  },
  sass: {
    entry: path.resolve('./client/index.scss'),
    output: DEST_STYLESHEETS,
    fileName: 'client.min.css',
    watchPaths: [path.resolve('./client/**/*.scss')]
  }
});

buildBundleTasks({
  name: 'pluginApp',
  scripts: {
    react: true,
    entry: path.resolve('./plugin/index.js'),
    modulesDirectories: [path.resolve('./plugin')],
    output: DEST_SCRIPTS,
    fileName: 'plugin.min.js'
  },
  sass: {
    entry: path.resolve('./plugin/index.scss'),
    output: DEST_STYLESHEETS,
    fileName: 'plugin.min.css',
    watchPaths: [path.resolve('./plugin/**/*.scss')]
  }
});

gulp.task('default', () => {
  gulp.run('serve.clientApp');
});

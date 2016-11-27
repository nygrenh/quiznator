const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

module.exports = options => () => {
  nodemon({
    script: './bin/www',
    ext: 'js',
    watch: options.watch || []
  });
}

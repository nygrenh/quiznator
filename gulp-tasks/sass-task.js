const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const classPrefix = require('gulp-class-prefix');
const plumber = require('gulp-plumber');

module.exports = options => () => {
  let pipeline = gulp.src(options.entry);

  if(options.isDevelopment) {
    pipeline = pipeline
      .pipe(plumber());
  }

  pipeline = pipeline
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename(`${options.fileName}.min.css`));

  if(options.classPrefix) {
    pipeline = pipeline
      .pipe(classPrefix(options.classPrefix));
  }

  if(!options.isDevelopment) {
    pipeline = pipeline
      .pipe(cleanCSS({ compatibility: 'ie8' }));
  }

  return pipeline
    .pipe(gulp.dest(options.output));
}

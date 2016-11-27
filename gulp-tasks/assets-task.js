const gulp = require('gulp');

module.exports = options => () => {
  return gulp.src(options.entries)
    .pipe(gulp.dest(options.output));
}

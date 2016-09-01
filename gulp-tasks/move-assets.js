const gulp = require('gulp');

module.exports = () => {
  return gulp.src('./assets/**/*')
    .pipe(gulp.dest('./dist/assets'));
}

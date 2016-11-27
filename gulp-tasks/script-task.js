const webpack = require('webpack-stream');
const gulp = require('gulp');
const plumber = require('gulp-plumber');

module.exports = options => () => {
  let pipeline = gulp.src(options.webpackConfig.entry);

  if(options.isDevelopment) {
    pipeline = pipeline.pipe(plumber());
  }

  return pipeline
    .pipe(webpack(options.webpackConfig))
    .pipe(gulp.dest(options.webpackConfig.output.path));
}

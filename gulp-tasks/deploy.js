const gulp = require('gulp');
const exec = require('gulp-exec');

module.exports = () => {
  return () => gulp.src('./package.json')
    .pipe(exec(`git push heroku master:master`))
    .pipe(exec.reporter({
      err: true,
  	  stderr: true,
  	  stdout: true
    }));
}

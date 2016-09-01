const gulp = require('gulp');

const webpackConfigBuilder = require('gulp-tasks/helpers/build-webpack-config');
const scriptTaskBuilder = require('gulp-tasks/helpers/build-script-task');
const sassTaskBuilder = require('gulp-tasks/helpers/build-sass-task');

module.exports = options => {
  const scriptOptions = options.scripts;
  const sassOptions = options.sass;
  const bundleName = options.name || 'app';

  const getEnv = scriptOptions.getEnv || (isDevelopment => ({}));

  const getWebpackConfig = isDevelopment => {
    return webpackConfigBuilder({
      entry: scriptOptions.entry,
      output: scriptOptions.output,
      fileName: scriptOptions.fileName,
      react: scriptOptions.react,
      modulesDirectories: scriptOptions.modulesDirectories || ['node_modules'],
      env: Object.assign({}, getEnv(isDevelopment), { NODE_ENV: isDevelopment ? 'development' : 'production' })
    });
  }

  let serveTasks = ['server', `scripts.${bundleName}`];
  let buildTasks = [`build:scripts.${bundleName}`];

  const scripTaskOptions = {
    src: scriptOptions.entry,
    dest: scriptOptions.output,
    fileName: scriptOptions.fileName
  }

  gulp.task(`scripts.${bundleName}`, scriptTaskBuilder(Object.assign({}, scripTaskOptions, {
    webpackConfig: getWebpackConfig(true)
  })));

  gulp.task(`build:scripts.${bundleName}`, scriptTaskBuilder(Object.assign({}, scripTaskOptions, {
    uglify: true,
    webpackConfig: getWebpackConfig(false)
  })));

  if(sassOptions) {
    serveTasks = [...serveTasks, `styles.${bundleName}`, `watch:styles.${bundleName}`];
    buildTasks = [...buildTasks, `build:styles.${bundleName}`];

    const sassTaskOptions = {
      src: sassOptions.entry,
      dest: sassOptions.output,
      fileName: sassOptions.fileName
    }

    gulp.task(`styles.${bundleName}`, sassTaskBuilder(Object.assign({}, sassTaskOptions)));

    gulp.task(`watch:styles.${bundleName}`, () => {
      gulp.watch(sassOptions.watchPaths, [`styles.${bundleName}`]);
    });

    gulp.task(`build:styles.${bundleName}`, sassTaskBuilder(Object.assign({}, sassTaskOptions, { uglify: true })));
  }

  gulp.task(`serve.${bundleName}`, serveTasks, () => {});

  gulp.task(`build.${bundleName}`, buildTasks, () => {});
}

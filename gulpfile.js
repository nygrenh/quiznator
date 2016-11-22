require('app-module-path').addPath(__dirname);

const gulp = require('gulp');
const path = require('path');

const buildBundleTasks = require('gulp-tasks/helpers/build-bundle-tasks');

const DEST_SCRIPTS = path.resolve('./dist/javascripts');
const DEST_STYLESHEETS = path.resolve('./dist/stylesheets');

gulp.task('server', require('./gulp-tasks/server'));

gulp.task('build', ['move-assets', 'build.signUp', 'build.signIn', 'build.plugin', 'build.dashboard', 'build.pluginLoader'], () => {});

gulp.task('deploy', require('gulp-tasks/deploy')());

gulp.task('serve', ['serve.signUp', 'serve.signIn', 'serve.plugin', 'serve.dashboard'], () => {});

gulp.task('move-assets', require('gulp-tasks/move-assets'));

function createScriptBundle({ entryPath, react = true, name, modulesDirectories = [] }) {
  return {
    react,
    entry: path.resolve(`${entryPath}/index.js`),
    modulesDirectories: [path.resolve(entryPath), ...modulesDirectories],
    output: DEST_SCRIPTS,
    getEnv: isDevelopment => {
      return {
        API_URL: isDevelopment ? 'http://localhost:3000' : 'https://quiznator.herokuapp.com'
      }
    },
    fileName: `${name}.min.js`
  }
}

function createSassBundle({ entryPath, name, classPrefix }) {
  return {
    entry: path.resolve(`${entryPath}/index.scss`),
    output: DEST_STYLESHEETS,
    fileName: `${name}.min.css`,
    classPrefix,
    watchPaths: [path.resolve(`${entryPath}/**/*.scss`)]
  }
}

buildBundleTasks({
  name: 'dashboard',
  scripts: createScriptBundle({ entryPath: './client/dashboard', name: 'dashboard', modulesDirectories: [path.join('./client/common')] }),
  sass: createSassBundle({ entryPath: './client/dashboard', name: 'dashboard' })
});

buildBundleTasks({
  name: 'signUp',
  scripts: createScriptBundle({ entryPath: './client/sign-up', name: 'sign-up', modulesDirectories: [path.join('./client/common')] }),
  sass: createSassBundle({ entryPath: './client/sign-up', name: 'sign-up' })
});

buildBundleTasks({
  name: 'signIn',
  scripts: createScriptBundle({ entryPath: './client/sign-in', name: 'sign-in', modulesDirectories: [path.join('./client/common')] }),
  sass: createSassBundle({ entryPath: './client/sign-in', name: 'sign-in' })
});

buildBundleTasks({
  name: 'plugin',
  scripts: createScriptBundle({ entryPath: './client/plugin', name: 'plugin', modulesDirectories: [path.join('./client/common')] }),
  sass: createSassBundle({ entryPath: './client/plugin', name: 'plugin', classPrefix: 'quiznator-' })
});

buildBundleTasks({
  name: 'pluginLoader',
  scripts: createScriptBundle({ entryPath: './client/plugin-loader', name: 'plugin-loader', modulesDirectories: [] })
});

gulp.task('default', () => {
  gulp.run('serve.plugin');
});

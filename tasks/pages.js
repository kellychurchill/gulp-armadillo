'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var gutil = require('gulp-util'),
    fm = require('../helpers/fm'),
    mark = require('../helpers/mark'),
    swig = require('../helpers/swig'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

//////////////////////////////
// Internal Vars
//////////////////////////////
var toPages = [
  'pages/**/*.md',
  'pages/**/*.html'
];

//////////////////////////////
// Export
//////////////////////////////
module.exports = function (gulp, PagesPaths) {
  // Set value of paths to either the default or user entered
  PagesPaths = PagesPaths || toPages;

  //////////////////////////////
  // Encapsulate task in function to choose path to work on
  //////////////////////////////
  var PagesTask = function (path) {
    return gulp.src(PagesPaths)
      .pipe(fm())
      .pipe(mark())
      .pipe(swig())
      .pipe(gulp.dest('dist/'))
      .pipe(reload({stream: true}));
  }

  //////////////////////////////
  // Core Task
  //////////////////////////////
  gulp.task('pages', function () {
    return PagesTask(PagesPaths);
  });

  //////////////////////////////
  // Watch Task
  //////////////////////////////
  gulp.task('pages:watch', function () {
    return gulp.watch(PagesPaths)
      .on('change', function (event) {
        // Add absolute and relative (to Gulpfile) paths
        event.path = {
          absolute: event.path,
          relative: event.path.replace(__dirname.replace('/tasks', '') + '/', '')
        }

        // Notify user of the change
        gutil.log('File ' + gutil.colors.magenta(event.path.relative) + ' was ' + event.type);

        // Call the task
        return PagesTask(event.path.absolute);
      });
  });
}
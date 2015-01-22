var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var packer = require('gulp-packer');
var streamify = require('gulp-streamify');
var fs = require('fs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', function() {
      exec('rm ./www/css/ionic.app.css');
      done.apply(this, arguments);
    });
});

gulp.task('jsmin-android', function() {
  exec('rm -rf build', function() {
    gulp.src('./platforms/**/*.js')
      .pipe(streamify(packer({base62: false, shrink: false})))
      .pipe(gulp.dest('build'))
      .on('finish', function() {
        exec('find build|grep android|grep -Ev "include|cordova|plugins"|grep -E "[.]js$"|grep -v .min.min.js$', function(err, stdout, stderr) {
          var arr = stdout.trim().split(/\s+/);
          for (var i = 0; i < arr.length; i++) {
            var path = arr[i];
            var newPath = path.replace(/^build\//, 'platforms/').replace(/[.]min[.]js/, '.js');
            console.log(newPath + ' compressed.');
            fs.renameSync(path, newPath);
          }

        });
      });
  })
});

gulp.task('jsmin-ios', function() {
  exec('rm -rf build', function() {
    gulp.src('./platforms/**/*.js')
      .pipe(streamify(packer({base62: false, shrink: false})))
      .pipe(gulp.dest('build'))
      .on('finish', function() {
        exec('find build|grep ios|grep -Ev "include|cordova|plugins"|grep -E "[.]js$"|grep -v .min.min.js$', function(err, stdout, stderr) {
          var arr = stdout.trim().split(/\s+/);
          for (var i = 0; i < arr.length; i++) {
            var path = arr[i];
            var newPath = path.replace(/^build\//, 'platforms/').replace(/[.]min[.]js/, '.js');
            console.log(newPath + ' compressed.');
            fs.renameSync(path, newPath);
          }

        });
      });
  })
});


gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['sass']);

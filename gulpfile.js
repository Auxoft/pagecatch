var gulp = require('gulp')
    config = require('./webpack.config.js')
    webpack = require('webpack-stream')


gulp.task('build-background-script-tag', function() {
  return gulp.src(config[0].entry)
    .pipe(webpack(config[0]))
    .pipe(gulp.dest('./examples/using-script-tag/chrome/extension'))
  }
)

gulp.task('build-background-require', function() {
  return gulp.src(config[3].entry)
    .pipe(webpack(config[3]))
    .pipe(gulp.dest('./examples/using-require/chrome/extension'))
  }
)

gulp.task('build-page-catch', function() {
  return gulp.src(config[1].entry)
    .pipe(webpack(config[1]))
    .pipe(gulp.dest('./examples/using-script-tag/chrome/extension'))
  }
)

gulp.task('build-page-catch-min', function() {
  return gulp.src(config[2].entry)
    .pipe(webpack(config[2]))
    .pipe(gulp.dest('./lib/'))
  }
)

gulp.task('copy-file-saver', function() {
 return gulp.src('./node_modules/file-saver/FileSaver.min.js')
   .pipe(gulp.dest('./examples/using-script-tag/chrome/extension'))
 }
)
gulp.task('build-extensions', function() {
  gulp.run(['build-background-script-tag', 'build-background-require', 'build-page-catch', 'copy-file-saver'])
  }
)
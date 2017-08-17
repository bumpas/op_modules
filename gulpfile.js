//gulp packages
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '*'],
  rename: {
    'node-notifier': 'notifier'
  }
});

var src = {
  sass: 'app/sass/**/*.scss',
  html: 'app/html/**/*.html'
};

gulp.task('sass', function(){

  return gulp.src(['app/sass/app.scss'])
    .pipe($.sass({
      // Sass error handler
      onError: function(error){

        console.log("SASS Error: " + error.file + " " + error.line + ":" + error.column + "\n" + error.message);

        $.notifier.notify({
          title: "SASS Error",
          subtitle: error.file + " " + error.line + ":" + error.column,
          message: error.message,
          sound: "Hero"
        });

      },
      outputStyle: 'nested',
      sourceComments: true
    }))

    // Autoprefixer
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))

    // Normal output
    .pipe(gulp.dest('dist/css'))

    // Reload Browser Sync
    .pipe($.browserSync.reload({stream: true}))

    // Rename file
    .pipe($.rename(function(path){
      path.basename += ".min";
    }))

    // Minify
    .pipe($.minifyCss())

    // Output
    .pipe(gulp.dest('./dist/css'));

});

gulp.task('html', function(){
  return gulp.src(src.html)
  .pipe($.concat('index.html'))
  .pipe(gulp.dest('./dist/'))
  .pipe($.browserSync.reload({stream: true}));
});

// Output fonts to build directory
gulp.task('build', function(){
  return gulp.src('app/fonts/**')
    .pipe(gulp.dest('dist/fonts'));
});

// Browser Sync serve task
gulp.task('serve', ['sass', 'html'], function(){

  $.browserSync.init({
    server: "./dist/"
  });

  gulp.watch(src.sass, ['sass']);
  gulp.watch(src.html, ['html']);
});

// Default task (serve up Browser Sync)
gulp.task('default', ['serve']);
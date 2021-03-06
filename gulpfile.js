//gulp packages
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '*'],
  rename: {
    'gulp-clean-css': 'cleanCSS',
    'node-notifier': 'notifier'
  }
});

var src = {
  sass: 'app/sass/**/*.scss',
  html: 'app/html/**/*.html',
  js:   'app/js/**/*.js'
};

var onError = function (err) {
  $.notify({
       title: 'Gulp Task Error',
       message: 'Check the console.',
       sound: 'Basso',
       closeLabel: 'Close'
   }).write(err);

  console.log(err.toString());
   
  this.emit('end');
}

gulp.task('sass', function(){

  return gulp.src([src.sass])
    .pipe($.sass({
      outputStyle: 'expanded',
      sourceComments: true
    }))

    .on('error', onError)

    // Autoprefixer
    .pipe($.autoprefixer({
      browsers: ['last 4 versions'],
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
    .pipe($.cleanCSS({level: 2}))

    // Output
    .pipe(gulp.dest('./dist/css'));

});

gulp.task('htmljs', function(){
  return gulp.src(src.html)
  .pipe($.concat('index.html'))
  .pipe($.useref())
  .pipe($.if('*.js', $.uglify()))
  .pipe(gulp.dest('./dist/'))
  .pipe($.browserSync.reload({stream: true}));
});

// Output fonts to build directory
gulp.task('fonts', function(){
  return gulp.src('app/fonts/**')
    .pipe(gulp.dest('dist/fonts'));
});

//output images to build directory
gulp.task('images', function(){
  return gulp.src('app/images/**')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/images'));
});

//Build fonts and images
gulp.task('assets', ['fonts', 'images']);

// Publish to ecommdev.office.otterbox.com/lifeproof/pattern-library
gulp.task('publish', ['assets'], function(){
  console.log("Publishing to http://ecommdev.office.otterbox.com/lifeproof/lp-homepage");
  return gulp.src('dist/**')
    .pipe($.rsync({
      hostname: 'ecommdev.office.otterbox.com',
      destination: '/vhosts/default/lifeproof/lp-homepage/',
      root: 'dist',
      incremental: true,
      progress: true,
      emptyDirectories: true,
      recursive: true,
      clean: true,
      exclude: ['.DS_Store']
    }));
});

// Browser Sync serve task
gulp.task('serve', ['sass', 'htmljs' ], function(){

  $.browserSync.init({
    server: "./dist/"
  });

  gulp.watch(src.sass, ['sass']);
  gulp.watch(src.html, ['htmljs']);
  gulp.watch(src.js, ['htmljs']);
});

// Default task (serve up Browser Sync)
gulp.task('default', ['serve']);
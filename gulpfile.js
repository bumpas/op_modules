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
  html: 'app/html/**/*.html',
  js:   'app/js/**/*.js'
};

gulp.task('sass', function(){

  return gulp.src(['app/sass/*.scss'])
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
      outputStyle: 'expanded',
      sourceComments: true
    }))

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
    .pipe($.minifyCss())

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
gulp.task('publish', ['build'], function(){
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
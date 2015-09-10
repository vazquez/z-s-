var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var del = require('del');
var cache = require('gulp-cache');

// The most basic gulp task
gulp.task('hello', function(){
  console.log('Hello, Ricardo');
});

// A more complex gulp task

// gulp.task('task-name', function () {
//   return gulp.src('source-files') // Get source files with gulp.src
//     .pipe(aGulpPlugin()) // Sends it through a gulp plugin
//     .pipe(gulp.dest('destination')) // Outputs the file in the destination folder
// })

// Put into practice:

// gulp.task('sass', function(){
//   return gulp.src('app/sass/styles.scss') // getting source files
//     .pipe(sass()) // sending it through the sass gulp plugin
//     .pipe(gulp.dest('app/css'))
// });

// What if we needed the ability to compile more than one .scss file at a time?

// Globbing in Node
// Globs are matching patterns for files that allow you to add more than one
// file into gulp.src. It's like regular expressions, but specifically for file paths.

// Put into practice:

// gulp.task('sass', function(){
//   return gulp.src('app/sass/**/*.scss') // getting ALL .scss files
//     .pipe(sass()) // sending it through the sass gulp plugin
//     .pipe(gulp.dest('app/css'))
// });

///////////////////////////////////////////////

// Gulp provides us with a watch method that checks to see if a file was saved.
// The syntax for the watch method is:

// gulp.watch('files-to-watch', ['tasks', 'to', 'run']);

// For our scss:

// gulp.watch('app/sass/**/*.scss', ['sass']);
// Watch for any scss file that is saved, and run the sass task on the file.


// We can make a task out of it:

// gulp.task('watch', function(){
//   gulp.watch('app/sass/**/*.scss', ['sass']);
//   // other gulp watch methods here
// });

/////////////////////////////////////////////////

// Using browser sync:

// We need to create a browserSync task to enable Gulp to spin up a server
// using Browser Sync. Since we're running a server, we need to let Browser Sync
// know where the root of the server should be. In our case, it's the `app` folder:

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
})

// The sass task needs to change a little bit as well, since browserSync needs
// to reload the page

gulp.task('sass', function(){
  return gulp.src('app/sass/**/*.scss') // getting ALL .scss files
    .pipe(sass()) // sending it through the sass gulp plugin
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Let's get Gulp to run watch and browserSync together by telling
// the watch task that browserSync must be completed before watch
// is allowed to run.

// This is the syntax:

// gulp.task('watch', ['array', 'of', 'tasks', 'to', 'complete','before', 'watch'], function (){
//   // ...
// })

// gulp.task('watch', ['sass','browserSync'], function(){
//   gulp.watch('app/sass/**/*.scss', ['sass']);
// })

// Since we're already watching for .scss files to reload, why not go a step
// further and reload the browser if any HTML or JavaScript file gets saved?

gulp.task('watch', ['sass','browserSync'], function(){
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload)
});


//////////////////////////////////


// OPTIMIZING IMAGES USING GULP
// We can minify png, jpg, gif and even svg with the help of gulp-imagemin.


gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|svg|gif)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
});

//////////////////////////////

// Since font files are already optimized, there's nothing more we need to do.
// All we have to do is to copy the fonts into dist.

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

/////////////////////////////////////

// CLEANING UP FILES AUTOMATICALLY

gulp.task('clean', function(callback)
  del('dist'); // This will delete the dist folder whenever task is called
  return cache.clearAll(callback); // Clearing fulp cache so the images task can
  // prociess all our images again
});

// This cleans everything in dist except for a few things
// We are deleting every file within dist, except for img and everything in it

gulp.task('clean:dist', function(){
  del(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

////////////////////////////////////

// COMBINING GULP TASKS

// The optimization tasks consist of tasks that we need to run to create the production website. This includes clean:dist, sass, useref, images and fonts.

// We need to use run-sequence to run these tasks in order.
// There is a possibility that images and fonts tasks get completed before clean does,
// .. which means the entire 'dist' folder gets deleted

// gulp.task('task-name', function(callback){
//   runSequence('task-one', 'task-two', callback);
// });

gulp.task('build', function(callback){
  runSequence('clean:dist', ['sass', 'images', 'fonts'], callback);
  // This runs clean:dist first and then sass, images, and fonts all at once
});

// To make it more consistent, we can also build the same sequence with the watch task
// Let's call it default, that way we just have to write `gulp` when we want to run it


gulp.task('default', function(){
  runSequence('sass', 'browserSync', 'watch');
});

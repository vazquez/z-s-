var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var del = require('del');
var cache = require('gulp-cache');

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('sass', function(){
  return gulp.src('app/sass/**/*.scss') // getting ALL .scss files
    .pipe(sass()) // sending it through the sass gulp plugin
    .pipe(gulp.dest('app/css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['sass'], function(){
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload)
});

gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|svg|gif)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function(callback){
  del('dist'); // This will delete the dist folder whenever task is called
  return cache.clearAll(callback); // Clearing fulp cache so the images task can
  // prociess all our images again
});

gulp.task('clean:dist', function(){
  del(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

gulp.task('build', function(callback){
  runSequence('clean:dist', ['sass', 'images', 'fonts'], callback);
  // This runs clean:dist first and then sass, images, and fonts all at once
});

gulp.task('default', function(){
  runSequence('sass', 'browserSync', 'watch');
});

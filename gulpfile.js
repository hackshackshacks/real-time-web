/* Require packages */
const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const clean = require('gulp-clean')
const gulpSequence = require('gulp-sequence')
const connect = require('gulp-connect')
const open = require('gulp-open')

/* === Tasks === */

/* Render html */
gulp.task('render', () => {
  gulp.src('src/templates/*.html')
  .pipe(nunjucks.compile())
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload())
})

/* Compile sass */
gulp.task('sass', () => {
  return gulp.src('src/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload())
})

/* Compile sass and minify for production */
gulp.task('sass-p', () => {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
})

/* Bundle scripts */
gulp.task('bundle', () => {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload())
})

/* Bundle scripts and minify */
gulp.task('bundle-p', () => {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

/* Process images */
gulp.task('images', () => {
  return gulp.src('src/images/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
  .pipe(connect.reload())
})

/* Process fonts */
gulp.task('fonts', () => {
  return gulp.src('src/fonts/*')
  .pipe(gulp.dest('dist/fonts'))
  .pipe(connect.reload())
})

/* Watch files for changes */
gulp.task('watch', () => {
  gulp.watch('src/templates/**/*.html', ['render'])
  gulp.watch('src/styles/**/*.scss', ['sass'])
  gulp.watch('src/scripts/**/*.js', ['bundle'])
  gulp.watch('src/images/**/*', ['images'])
  gulp.watch('src/fonts/*', ['fonts'])
})

/* Remove dist folder to remove unused files */
gulp.task('clean', () => {
  return gulp.src('dist')
  .pipe(clean())
})

// Start server
gulp.task('connect', () => {
  connect.server({
    root: '.',
    livereload: true
  })
})

// Open browser at localhost:8080
gulp.task('open', () => {
  gulp.src('')
  .pipe(open({uri: 'http://localhost:8080/dist'}))
})

// Combined tasks
gulp.task('default', ['render', 'sass', 'bundle', 'images', 'fonts', 'connect', 'watch'])
gulp.task('start', gulpSequence(['render', 'sass', 'bundle', 'images', 'fonts', 'connect', 'watch'], 'open'))
gulp.task('prod', gulpSequence('clean', ['render', 'sass-p', 'bundle-p', 'images', 'fonts', 'connect']))

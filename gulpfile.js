var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jsdoc = require("gulp-jsdoc");

gulp.task('default', function () {
    gulp.src('./src/*.js')
        .pipe(concat("sir-trevor-adapter.js"))
        .pipe(gulp.dest("."))
        .pipe(rename('sir-trevor-adapter.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("."))
});

gulp.task('doc', function() {
    gulp.src("./src/*.js")
      .pipe(jsdoc('./doc'))
})
var gulp = require('gulp'),
    gutil = require("gulp-util"),
    addsrc = require('gulp-add-src'),
    jsdoc = require('gulp-jsdoc'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag = require('gulp-tag-version'),
    webpack = require('webpack'),
    webpackConf = require('./webpack.config.js');

/**
 * Generates the bundled version of the library,
 * @param {Boolean} isProd - Defines if building for production or not. If prod output will be minified
 * @returns {Function} A gulp task function
 */
var webpackTask = function(isProd) {
    return function (cb) {
        webpack(webpackConf(isProd), function (err, stats) {
            if(err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString());
            cb();
        });
    }  
}

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
var inc = function(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type: importance}))            // bump the version number in those files
        .pipe(gulp.dest('./'))                     // save it back to filesystem
        .pipe(addsrc(['./sir-trevor-adapter.*', './sir-trevor-adapter.min.*']))
        .pipe(git.commit('bump package version'))  // commit the changed version number
        .pipe(filter('package.json'))              // read only one file to get the version number
        .pipe(tag({ prefix: '' }))                 // **tag it in the repository**
}

gulp.task('compile-dev', webpackTask(false));
gulp.task('compile-prod', webpackTask(true));
gulp.task('compile', [ 'compile-dev', 'compile-prod' ]);

gulp.task('tag-patch', function() { return inc('patch'); });
gulp.task('tag-feature', function() { return inc('minor'); });
gulp.task('tag-release', function() { return inc('major'); });

gulp.task('patch', ['compile', 'tag-patch'])
gulp.task('feature', ['compile', 'tag-feature'])
gulp.task('release', ['compile', 'tag-release'])

gulp.task('doc', function() {
    gulp.src("./src/*.js")
      .pipe(jsdoc('./doc'))
})
gulp.task('docs', ['doc'])

gulp.task('default', ['compile'])
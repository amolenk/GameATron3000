var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var browserSync = require("browser-sync");
var paths = {
    pages: ['src/*.html']
};

var browserify = browserify({
    basedir: '.',
    debug: true,
    entries: ['src/app.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify);

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function() {

    return browserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
});

gulp.task("watch", ["default"], function() {

    browserSync.init({
        server: "dist",
        browser: "google chrome"
    });

    gulp.watch(["src/**/**.ts"], ["default"]);
    gulp.watch("dist/*.ts").on('change', browserSync.reload); 
});
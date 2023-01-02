'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const webpack = require('webpack-stream');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync');
const compiler = require('webpack');

function sassTask() {
    return gulp.src(['src/scss/main.scss'], { base: 'src/scss', sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('www/css', { sourcemaps: '.' }));
}

function webpackTask() {
    return gulp.src(['src/js/main.js'], { base: 'src/js', sourcemaps: true })
        .pipe(webpack(require('./webpack.config.js'),
                       compiler))
        .pipe(gulp.dest('www/js', { sourcemaps: '.' }));
}

function watchSassTask(){
    return gulp.watch(['src/scss/**/*.scss'], {
        ignoreInitial: false,
    }, sassTask);
}

function watchWebpackTask() {
    return gulp.watch(['src/js/**/*.js'], {
        ignoreInitial: false,
    }, webpackTask);
}

function serveTask() {
}

const watchTask = gulp.parallel(watchSassTask, watchWebpackTask);

module.exports = {
    sass: sassTask,
    webpack: webpackTask,
    watch: watchTask,
    serve: serveTask,
};

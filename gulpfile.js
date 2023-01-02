'use strict';

const gulp = require('gulp');
const $sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const $webpack = require('gulp-webpack');
const $postcss = require('gulp-postcss');
const browserSync = require('browser-sync');

function sassTask() {
    return gulp.src(['src/scss/main.scss'], { base: 'src/scss', sourcemaps: true })
        .pipe($sass())
        .pipe($postcss([autoprefixer()]))
        .pipe(gulp.dest('www/css', { sourcemaps: '.' }));
}

module.exports = {
    sass: sassTask,
};

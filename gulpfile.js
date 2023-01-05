'use strict';

const colors = require('@colors/colors/safe');
if (!process.stdout.isTTY || !process.stderr.isTTY) {
    colors.disable();
}

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync');
const webpack = require('webpack');

let server;
let compiler;

/**
 * We set this to true if we're running a watch or serve task.
 */
let isWatching = false;
let continueOnError = false;

function errorHandler(type) {
    return function (error) {
        console.error(colors.brightYellow.bold(`[${error.type}] ${error.name}: ${error.message}`));
        if (continueOnError) {
            // this stops the stream so tasks can finish
            this.emit('end');
        }
    };
}

/**
 * For reducing the number of browsersync reload calls.
 */
let taskCounter = 0;

function bsStartTask(cb) {
    taskCounter += 1;
    cb();
}

function bsEndTask(cb) {
    taskCounter -= 1;
    if (taskCounter === 0) {
        server.reload();
    }
    cb();
}

function sassTask() {
    return gulp.src(['src/scss/*.scss'], { base: 'src/scss', sourcemaps: true })
        .on('error', errorHandler('gulp.src'))
        .pipe(sass())
        .on('error', errorHandler('sass'))
        .pipe(postcss([autoprefixer()]))
        .on('error', errorHandler('postcss'))
        .pipe(gulp.dest('www/css', { sourcemaps: '.' }))
        .on('error', errorHandler('gulp.dest'))
    ;
}

function webpackTask() {
    if (!compiler) {
        compiler = webpack(require('./webpack.config.js'));
    }
    return new Promise((resolve, reject) => {
        compiler.run(function (error, stats) {
            if (error) {
                reject(error);
                return;
            }
            if (stats.hasErrors()) {
                const errors = stats.toJson().errors;
                reject(new Error(errors.map(e => e.message).join("\n\n")));
                console.log('AAAAAAAAAAAAAAAAA');
                return;
            }
            resolve();
        });
    });
}

const bsSassTask    = gulp.series(bsStartTask, sassTask, bsEndTask);
const bsWebpackTask = gulp.series(bsStartTask, webpackTask, bsEndTask);

const gulpWatchOptions = {
    ignoreInitial: false,
};

function watchSassTask() {
    return gulp.watch(['src/scss/**/*.scss'], gulpWatchOptions, server ? bsSassTask : sassTask);
}

function watchWebpackTask() {
    return gulp.watch(['src/js/**/*.js'], gulpWatchOptions, server ? bsWebpackTask : webpackTask);
}

function browserSyncTask(cb) {
    server.init({
        server: {
            baseDir: './www/',
        },
        open: false,
    });
    cb();
}

function serveTaskSetup(cb) {
    server = browserSync.create();
    isWatching = true;
    continueOnError = true;
    gulpWatchOptions.ignoreInitial = true;
    cb();
}

const serveTask = gulp.series(serveTaskSetup,
                              gulp.parallel(sassTask, webpackTask),
                              browserSyncTask,
                              gulp.parallel(watchSassTask, watchWebpackTask));

function watchTaskSetup(cb) {
    isWatching = true;
    continueOnError = true;
    gulpWatchOptions.ignoreInitial = false;
    cb();
}

const watchTask = gulp.series(watchTaskSetup,
                              gulp.parallel(watchSassTask, watchWebpackTask));

function copyFontAwesomeWebFonts() {
    return gulp.src(['node_modules/@fortawesome/fontawesome-free/webfonts/**/*.*'],
                    { base: 'node_modules/@fortawesome/fontawesome-free/webfonts' })
        .pipe(gulp.dest('www/webfonts/fontawesome'));
}

const updateTask = gulp.series(
    copyFontAwesomeWebFonts,
);

module.exports = {
    update: updateTask,
    sass: sassTask,
    webpack: webpackTask,
    watch: watchTask,
    serve: serveTask,
};

'use strict';
// https://createapp.dev/webpack/no-library

const path = require('path');

const config = {
    entry: {
        main:    './src/js/main.js',
        cordova: './src/js/cordova-app.js',
    },
    output: {
        path: path.resolve(__dirname + 'www/js'),
        filename: '[name].bundle.js',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'source-map',
};

module.exports = config;

'use strict';
// https://createapp.dev/webpack/no-library

const path = require('path');

const config = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname + 'www/js'),
        filename: 'main.bundle.js',
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

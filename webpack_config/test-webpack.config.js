const path = require('path');
const webpack = require('webpack');


module.exports = {
    
    mode: 'development',
    devtool: 'source-map',
    entry: './test/index.ts',
    plugins:[

    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'test.js',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, '../dist')
    },
};
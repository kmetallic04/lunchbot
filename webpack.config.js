var path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/dashboard/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js')
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                ],
                loader: 'babel-loader',
                query: {
                    presets: [
                        'react',
                        'env',
                        'stage-1'
                    ]
                }
            },
            {
                test: /\.scss$/,
                use : [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            minimize: true
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    }
}

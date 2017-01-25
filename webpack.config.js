const webpack = require('webpack');
const path = require('path');

// Okay, this may be confusing at first glance but go through it step-by-step
module.exports = {
    // entry tells webpack where to start looking.
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8060', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './src/index.jsx' // Your appʼs entry point
    ],
    /**
     * output tells webpack where to dump the files it has processed.
     * [name].[hash].js will output something like app.3531f6aad069a0e8dc0e.js
     */
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './build/'),
        publicPath: '/build'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            webworkify: 'webworkify-webpack',
            'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
        }
    },
    module: {
        rules: [ // Loaders allow you to preprocess files!
            {
                test: /\.(jsx)$/, // look for .js files
                use: [
                    {
                        loader: 'react-hot-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: { presets: ['es2015', 'react'] },
                    },


                ],
                exclude: [/node_modules/],
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
                use: [
                    {loader: 'worker'}
                ]

            },
            {
                test: /mapbox-gl.+\.js$/,
                use: [
                    {loader: 'transform-loader/cacheable?brfs'}
                ]

            }
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port: 8060
    }
};
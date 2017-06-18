
const webpack = require('webpack');
const path = require('path');

module.exports = {

    entry: {
        "app": path.resolve(__dirname, './src/app.js')
    },

    output: {
        path: path.resolve(__dirname, './public/dist/js'),
        filename: '[name].bundle.js'
    },

    module: {
        
        rules: [
            {
                enforce: 'pre',
                test: /\.tag$/,
                loader: 'riotjs-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(js$|\.tag)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ["es2015"]
                }
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: "json-loader"
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({riot: "riot"})
    ],

    devtool: "source-map"
}

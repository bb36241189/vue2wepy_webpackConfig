/**
 * Created by Administrator on 2017/5/2 0002.
 */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    entry : {
        app : path.resolve('./app.js'),
    },
    output : {
        path : path.resolve('./dist'),
        filename : '[name].[hash:8].js'
    },
    module : {
        loaders : [
            {test : /\.css$/ , loader : "style-loader!css-loader"},
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue(\?[^?]+)?$/,
                loaders: ['vue-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[ext]'
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title : '玩游戏赚钱',
            chunks: ['app'],
            template : 'index.html',
            filename : 'index.html'
        })
    ]
};

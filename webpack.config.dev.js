/**
 * Created by Administrator on 2017/5/2 0002.
 */
const webpack = require('webpack');
const basic = require('./webpack.config.basic');
basic.plugins.push(new webpack.DefinePlugin({
    'SERVER_BASE_URL': '\'http://actest.activity.ffrj.net/gamecenter-test\'',
    // 'SERVER_BASE_URL': '\'http://games.fenfenriji.com/gamecenter\'',
    'WEBPACK_ENV':'\'development\''
}));
module.exports = basic;
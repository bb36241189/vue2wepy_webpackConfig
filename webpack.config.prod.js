/**
 * Created by Administrator on 2017/5/2 0002.
 */
const webpack = require('webpack');
const basic = require('./webpack.config.basic');
basic.output.publicPath = '/web/act/gameCenter/';
// basic.output.publicPath = '/games/gameCenter/';
basic.plugins.push(new webpack.DefinePlugin({
    // 'SERVER_BASE_URL': '\'http://api.55zala.cn/gamecenter\'',
    'SERVER_BASE_URL': '\'http://games.fenfenriji.com/gamecenter\'',
    'WEBPACK_ENV':'\'production\''
}));
module.exports = basic;
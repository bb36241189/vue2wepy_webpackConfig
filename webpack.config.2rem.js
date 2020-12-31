/**
 * Created by Administrator on 2017/5/2 0002.
 */
const ToRemPlugin = require('./webpack.toRem');
const basic = require('./webpack.config.basic');
basic.plugins.push(new ToRemPlugin());
module.exports = basic;
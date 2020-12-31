/**
 * Created by Administrator on 2017/5/2 0002.
 */
const ToRpxPlugin = require('./webpack.toRpx')
const basic = require('./webpack.config.basic');
basic.plugins.push(new ToRpxPlugin());
module.exports = basic;
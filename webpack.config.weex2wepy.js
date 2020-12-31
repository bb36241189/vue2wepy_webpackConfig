/**
 * Created by Administrator on 2017/5/2 0002.
 */
const weex2wepyPlugin = require('./webpack.weex2wepy')
const basic = require('./webpack.config.basic');
basic.plugins.push(new weex2wepyPlugin());
module.exports = basic;
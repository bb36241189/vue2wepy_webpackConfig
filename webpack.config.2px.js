/**
 * Created by Administrator on 2017/5/2 0002.
 */
const ToPxPlugin = require('./webpack.toPx')
const basic = require('./webpack.config.basic');
basic.plugins.push(new ToPxPlugin());
module.exports = basic;
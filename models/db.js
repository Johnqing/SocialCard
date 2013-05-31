/**
 * 数据库文件
 * User: jonery
 * Date: 13-5-10
 * Time: 下午11:10
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose')
    , settings = require('../setting');
module.exports = mongoose.connect( settings.db );
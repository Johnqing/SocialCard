/**
 * 数据库文件
 * User: jonery
 * Date: 13-5-10
 * Time: 下午11:10
 * To change this template use File | Settings | File Templates.
 */
var settings = require('../setting'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));
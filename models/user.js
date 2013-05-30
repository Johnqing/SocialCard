/**
 * user.js则实现如何从数据库中存和取用户名和密码
 * User: jonery
 * Date: 13-5-10
 * Time: 下午11:35
 */
var mongodb = require('./db');

var User = function(user){
    this.uid = user.uid;
    this.password = user.password;
}
/**
 * 保存数据
 * @type {{save: Function}}
 */
User.prototype = {
    save: function(callback){
        var user = {
            uid: this.uid,
            password: this.password
        }
        mongodb.open(function(err, db){
            if(err){return callback(err)}
            //表:users
            db.collection('users', function(err, collection){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                /**
                 * ensureIndex
                 * 第一个参数是selector，第二个参数是选项，有unique（唯一索引）等mongoDB索引选项。
                 * ensureIndex先查找是否存在这个索引，如果不存在，则建立索引，因此不会出现重复建立的情况。
                 */
                collection.ensureIndex('uid', {
                    unique: true
                });
                collection.insert(user, {safe: true}, function(err, user){
                    mongodb.close();
                    console.log(err);
                    callback(err, user);
                });

            });
        });
    }
}
/**
 * 查找用户名数据
 * @param username
 * @param callback
 */
User.get = function(uid, callback){
    mongodb.open(function(err, db){
        if(err){return callback(err)};

        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                uid: uid
            },function(err, doc){
                mongodb.close();
                if(doc){
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
}

module.exports = User;
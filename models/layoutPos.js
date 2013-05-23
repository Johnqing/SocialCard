/**
 * 文章相关
 * User: jonery
 * Date: 13-5-11
 * Time: 下午4:29
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('./db');

var LayoutPos = function(pos){
    this.pos = pos;
}

LayoutPos.prototype = {
    save: function(callback){
        var self = this;
        mongodb.open(function(err, db){
            if(err){
                return callback(err);
            }
            db.collection('layout', function(err, collection){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                collection.ensureIndex('user');
                collection.insert(self.pos, {
                    safe: true
                }, function(err, post){
                    mongodb.close();
                    callback(err, post);
                });

            });
        });
    }
};

LayoutPos.get = function(username, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('layout', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};

            if(username){
                query.username = username;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    callback(err);
                }
                var postion = [];

                docs.forEach(function(doc, index){
                    var newDoc = {
                        user: doc.username,
                        title: doc.title,
                        pos: doc.pos
                    };
                    postion.push(newDoc);
                });

                callback(null, postion);
            });

        });



    });
}

module.exports = LayoutPos;
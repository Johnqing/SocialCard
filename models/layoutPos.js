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
                console.log('save:'+self.pos);
                collection.ensureIndex('user');
                collection.update({"name": self.pos.username}, {$set: self.pos},  {upsert:true}, function(err, layout){
                    mongodb.close();
                    callback(err, layout);
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
                    console.log(docs);
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null, {
                    pos: docs[0]
                });
            });

        });



    });
}

module.exports = LayoutPos;
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
                collection.update({"uid": self.pos.uid}, {$set: self.pos},  {upsert:true}, function(err, layout){
                    mongodb.close();
                    callback(err, layout);
                });

            });
        });
    }
};

LayoutPos.get = function(uid, callback){
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

            if(uid){
                query.uid = uid;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs){
                //console.log(docs[0]);
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null, docs[0]);
            });

        });



    });
}

module.exports = LayoutPos;
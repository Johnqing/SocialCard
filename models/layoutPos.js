/**
 * 文章相关
 * User: jonery
 * Date: 13-5-11
 * Time: 下午4:29
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('./db'),
    Schema = mongoose.Schema;


var infoSchema = new Schema({
    uid: String,
    username: String,
    tags: String,
    des: String,
    pos: Object,
    controller: Object
});

infoSchema.pre('save', function (next) {
    next();
});

mongoose.model('layout', infoSchema);
var LayoutModel = mongoose.model('layout');


var LayoutPos = {};

LayoutPos.save = function(uid, data, callback){
    LayoutModel.update({uid: uid}, {$set: data}, {upsert: true, multi: false}, function(err, doc){
       callback(err, doc);
    });
};
LayoutPos.get = function(uid, callback){
    LayoutModel.find({uid: uid}, function(err, doc){
        callback(err, doc[0]);
    });
}

module.exports = LayoutPos;
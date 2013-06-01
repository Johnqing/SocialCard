/**
 * user.js则实现如何从数据库中存和取用户名和密码
 * User: jonery
 * Date: 13-5-10
 * Time: 下午11:35
 */
var mongoose = require('./db')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
    uid: String,
    password: String
});

userSchema.pre('save', function (next) {
    next();
});

mongoose.model('users', userSchema);
var UserModel = mongoose.model('users');
/**
 * 保存数据
 * @type {{save: Function}}
 */
var User = {};
User.save = function(user, callback){
    UserModel.create(user, function(err, doc){
        callback(err, doc);
    });
};
/**
 * 查找用户名数据
 * @param username
 * @param callback
 */
User.get = function(uid, callback){
    UserModel.findOne({uid: uid}, function(err, doc){
        callback(err, doc);
    });
};
module.exports = User;
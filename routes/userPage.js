var User = require('../models/user')
    , layoutPos = require('../models/layoutPos');

 //用户信息设置
function userInfoUp(userInfo) {
    userInfo = userInfo || {};

    if(!userInfo.pos){
        userInfo.pos = 0;
    }
    if(!userInfo.controller){
        userInfo.controller = 0;
    }

    userInfo.username = userInfo.username || "姓名";
    userInfo.tags = userInfo.tags || "";
    userInfo.des = userInfo.des || "";
    userInfo.bodyColor = userInfo.bodyColor || {bg:'', op: '1', color: '#000000'};
    userInfo.pageColor = userInfo.pageColor || {bg:'', op: '1', color: '#000000'};
    userInfo.nameColor = userInfo.nameColor || {color: '#000000'};
    userInfo.tagsColor = userInfo.tagsColor || {color: '#000000'};
    userInfo.desColor = userInfo.desColor || {color: '#000000'};
    userInfo.conColor = userInfo.conColor || {color: '#000000'};
    userInfo.linksColor = userInfo.linksColor || {color: '#000000'};
    return userInfo;
};

module.exports = function(req, res){
    User.get(req.params.user, function(err, user){
        if(!user){
            req.flash('error', '该用户不存在！');
            return res.redirect('/')
        }
        layoutPos.get(user.uid, function(err, userInfo){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            userInfo = userInfoUp(userInfo);
            console.log(userInfo);
            res.render('user',{
                title:'主页',
                user: req.session.user,
                pos: userInfo,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
}
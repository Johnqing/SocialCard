var crypto = require('crypto')
    , User = require('../models/user')
    , layoutPos = require('../models/layoutPos')
    , userPage = require('./userPage');

/**
 * 检测登录状态
 * @type {{notLogin: Function, login: Function}}
 */
var loginChect = {
    notLogin: function(req, res, next){
        if(req.session.user){
            req.flash('error', '已经登录!');
            return res.redirect('/'+req.session.user.uid);
        }
        next();
    },
    login: function(req, res, next){
        if(!req.session.user){
            req.flash('error', '未登录!');
            return res.redirect('/login');
        }
        next();
    }
};

module.exports = function(app){
    //index
    app.get('/', loginChect.notLogin);
    app.get('/', function(req, res){
        res.render('index',{
            title:'主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/', loginChect.notLogin);
    app.post('/', function(req, res){
        if(req.body['password-repeat'] != req.body['password']){
            req.flash('error','两次输入的口令不一致');
            return res.redirect('/');
        }
        //密码加密
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        //传参给user模块
        var newUser = {
            uid: req.body.username,
            username: req.body.username,
            password: password
        };
        //查询数据库存在此用户名
        User.get(newUser.uid, function(err, user){
            if(user){
                err = '用户已存在';
            }
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }

            User.save(newUser, function(err){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                //session里储存用户名
                req.session.user = newUser;
                req.flash('success','注册成功');
                res.redirect('/'+newUser.uid);
            });
        });
    });
//  login
    app.get('/login', loginChect.notLogin);
    app.get('/login',function(req, res){
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', loginChect.notLogin);
    app.post('/login',function(req, res){
        var md5 = crypto.createHash('md5');
        var sUser = {
            uid: req.body.username,
            password: md5.update(req.body.password).digest('base64')
        };
        User.get(req.body.username, function(err, user){
            //如果用户名不存在，通过flash记录信息，并调整回去显示错误信息
            if(!user){
                req.flash('error', '用户不存在！');
                return res.redirect('/login');
            }
            //密码错误
            if(user.password != sUser.password){
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            //登录成功，记录session并跳回首页
            req.session.user = sUser;
            req.flash('success', '登录成功！');
            res.redirect('/'+sUser.uid);
        });

    });
//  logout
    app.get('/logout',loginChect.login);
    app.get('/logout',function(req, res){
        req.session.user = null;
        req.flash('success', '退出成功!');
        res.redirect('/login');
    });
    //user
    app.get('/:user', userPage);
    app.post('/layoutPage', function(req, res){
        var data = {
            pos: req.body
        };
        layoutPos.save(req.session.user.uid, data, function(err){
            if(err){
                req.flash('error', err);
                return res.json({error: err});
            }
            res.json({success: 1})
        });
    });
    app.post('/controller', function(req, res){
        var data = {
            controller: req.body
        };
        layoutPos.save(req.session.user.uid, data, function(err){
            if(err){
                req.flash('error', err);
                return res.json({error: err});
            }
            res.json({success: 1})
        });
    });
    //存入变化
    app.post('/saveChange', function(req, res){
        var data = req.body;
        if(data.des){
            data.des = data.des.replace(/\'/ig,"&quot;");
        }
        console.log(data);
        layoutPos.save(req.session.user.uid, data, function(err){
            if(err){
                req.flash('error', err);
                return res.json({error: err});
            }
            res.json({success: 1})
        });
    });
};


/**
 * 重写路由
 * app.get 是在用户访问当前页面的时候，展示的数据
 * app.post 是用户操作
 * render 是渲染模板函数
 * @param app
 */
/**
 * crypto 是 Node.js 的一个核心模块，功能是加密并生成各种散列，使用它之前
 * 首先要声明 var crypto = require('crypto')。我们代码中使用它计算了密码的散列值。
 * user.js则实现如何从数据库中存和取用户名和密码。
 */
var crypto = require('crypto')
    , User = require('../models/user')
    , layoutPos = require('../models/layoutPos');

/**
 * 检测登录状态
 * @type {{notLogin: Function, login: Function}}
 */
var loginChect = {
    notLogin: function(req, res, next){
        if(req.session.user){
            req.flash('error', '已经登录!');
            return res.redirect('/');
        }
        next();
    },
    login: function(req, res, next){
        if(!req.session.user){
            req.flash('error', '未登录!');
            return res.redirect('/');
        }
        next();
    }
};

module.exports = function(app){
    //index
    app.get('/', function(req, res){
        res.render('index',{
            title:'主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    //    req
    app.get('/reg', loginChect.notLogin);
    app.get('/reg', function(req, res){
           res.render('reg', {
               title:'注册',
               user: req.session.user,
               success: req.flash('success').toString(),
               error: req.flash('error').toString()
           })
    });
    app.post('/reg', loginChect.notLogin);
    app.post('/reg', function(req, res){
        if(req.body['password-repeat'] != req.body['password']){
            req.flash('error','两次输入的口令不一致');
            return res.redirect('/reg');
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
            console.log(user);
            if(user){
                err = '用户已存在';
            }
            if(err){
                req.flash('error', err);
                return res.redirect('/reg');
            }

            User.save(newUser, function(err){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                //session里储存用户名
                req.session.user = newUser;
                req.flash('success','注册成功');
                res.redirect('/');
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
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('base64');

        User.get(req.body.username, function(err, user){
            //如果用户名不存在，通过flash记录信息，并调整回去显示错误信息
            if(!user){
                req.flash('error', '用户不存在！');
                return res.redirect('/login');
            }
            //密码错误
            if(user.password != password){
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            //登录成功，记录session并跳回首页
            req.session.user = user;
            req.flash('success', '登录成功！');
            res.redirect('/');
        });

    });
//  logout
    app.get('/logout',loginChect.login);
    app.get('/logout',function(req, res){
        req.session.user = null;
        req.flash('success', '退出成功!');
        res.redirect('/');
    });
    //user
    app.get('/:user', function(req, res){
        console.log('1'+req.params.user);
        User.get(req.params.user, function(err, user){
            if(!user){
                req.flash('error', '该用户不存在！');
                return res.redirect('/')
            }
            layoutPos.get(user.uid, function(err, userInfo){
                if(err){
                    req.flash('error', err);
                    return res.redirect('/');
                };
                userInfo = userInfoUp(userInfo);
                res.render('user',{
                    title:'主页',
                    user: userInfo,
                    pos: userInfo.pos,
                    controller: userInfo.controller,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
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
            return userInfo;
        }
    });
    app.post('/layoutPage', function(req, res){
        var data = {
            uid: req.session.user.uid,
            pos: req.body
        };
        layoutPos.save(data, function(err){
            if(err){
                req.flash('error', err);
                return res.json({error: err});
            }
            res.json({success: 1})
        });
    });
    app.post('/controller', function(req, res){
        var data = {
            uid: req.session.user.uid,
            controller: req.body
        };
        layoutPos.save(data, function(err){
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
        data.uid = req.session.user.uid;
        if(data.des){
            data.des = data.des.replace(/\'|\"/ig,"&quot;");
        }
        layoutPos.save(data, function(err){
            if(err){
                req.flash('error', err);
                return res.json({error: err});
            }
            res.json({success: 1})
        });
    });
};


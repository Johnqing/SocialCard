/**
 * express构建项目 express -e ejs 项目名字
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
    //   connect-mongo模块用来存储会话信息到数据库(3.0版本后尾部的express必须添加)
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./setting')
//    flash模块用来实现页面的通知和错误信息显示功能
  , flash = require('connect-flash');


var app = express();

//所有环境下
app.configure(function(){
    //设置端口
    app.set('port', process.env.PORT || 3000);
    //Express对MVC中views的默认目录设置
    app.set('views', __dirname + '/view');
    // 以下两步操作即是对HTML文件渲染的设置
    // include header.html必须加.html后缀
    app.set('view engine', 'html');
    app.engine('.html', require('ejs').__express);
    //app.set('view engine', 'ejs');
    app.use(flash());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    /**
     * express.cookieParser() 是 Cookie 解析的中间件
     * express.session() 则提供会话支持，设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免丢失
     */
    app.use(express.cookieParser());
    app.use(express.session({
        secret: settings.cookieSecret,
        store: new MongoStore({
            db: settings.db
        })
    }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'assets')));
});
//开发环境
app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * 删掉此处路由代码，放在routes/index.js下
 */
//app.get('/', routes.index);
//app.get('/users', user.list);

routes(app);
/**
 * 视图助手
 * 为了实现不同登录状态下页面呈现不同内容的功能，我们需要创建动态视图助手，通过它我们才能在视图中访问会话中的用户数据。
 * 同时为了显示错误和成功的信息，也要在动态视图助手中增加响应的函数。
 */
//req.flash 是 Express 提供的一个奇妙的工具，通过它保存的变量只会在用户
// 当前和下一次的请求中被访问，之后会被清除，
// 通过它我们可以很方便地实现页面的通知和错误信息显示功能。
app.use(function(req, res, next){
    var err = req.flash('error')
        , success = req.flash('success');

// 在最新的ejs中，加入了作用域的概念，在模版文件中不能直接引用变量名来访问变量，而需要使用locals.xxx来访问相应的变量。
// 这样做是为了避免全局变量的污染和冲突。
    res.locals.user = req.session.user;
    res.locals.error = err.length ? err : null;
    res.locals.success = success.length ? success : null;
    next();
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

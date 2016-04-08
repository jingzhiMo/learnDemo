var express = require('express'),
	mongo   = require('mongoose'),
	session = require('express-session'),
	config  = require('./config'),
	router  = require('./lib/router/router');

var accountFilter = require('./lib/filter/accountFilter');

var app = express();

// 部署前端资源
app.use(express.static('app'))
   .use(express.static('uploads'))
   .use(express.static('bower_components'))
   .use(session({
   		secret: 'keyboard cat recommand 128 bytes random string',
   		cookie: { maxAge: 50 * 60 * 1000 } // cookie 时长为30分钟
   }))
   .use(accountFilter);

// 监听端口
var server = app.listen(3000, function() {

	// 连接数据库
	mongo.connect(config.db.mongodb);
	console.log('server is running');
});

// 布置页面路由
router(app);
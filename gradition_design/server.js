var express = require('express'),
	mongo   = require('mongoose'),
	config  = require('./config'),
	router  = require('./lib/router/router');

var app = express();

// 部署前端资源
app.use(express.static('app'))
   .use(express.static('favicon.ico'));

// 监听端口
var server = app.listen(3000, function() {

	// 连接数据库
	mongo.connect(config.db.mongodb);
	console.log('server is running');
});

// 布置页面路由
router(app);
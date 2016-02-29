var express = require('express'),
	mongo   = require('mongoose'),
	config  = require('./config');

var app = express();

// 部署前端资源
app.use(express.static('app'));

// 页面路由
app.get('/', function(req, res) {
	res.send(JSON.stringify(config));
})
.get('/init', function(req, res) {
	// TODO
	res.send(config.db.mongodb);
});

var server = app.listen(3000, function() {

	// 连接数据库
	mongo.connect(config.db.mongodb);
	
	console.log('server is running');
});
var express = require('express'),
	port = 3000;

var app = express();
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.listen(port);
console.log('server starting');

// 编写路由
// 1. 首页
app.get('/', function(req, res) {
	res.render('index', {
		title: '首页'
	});
});
// 2.列表页
app.get('/list', function(req, res) {
	res.render('list', {
		title: '列表页'
	});
});
// 3.详情页
app.get('/detail', function(req, res) {
	res.render('detail', {
		title: '详情页'
	});
});
// 4.后台录入页
app.get('/admin', function(req, res) {
	res.render('admin', {
		title: '后台录入页面'
	});
});
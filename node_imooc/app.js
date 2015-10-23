var express = require('express'),
	path = require('path'),
	port = 3000;

var app = express();
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'bower_components')));
app.listen(port);
console.log('server starting');

// 编写路由
// 1. 首页
app.get('/', function(req, res) {
	res.render('index', {
		movies: [
			{
				'_id': 1,
				'title': '电影名1',
				'poster': 'http://i1.sinaimg.cn/gm/2014/0415/U10229P115DT20140415134404.jpg'
			},
			{
				'_id': 2,
				'title': '电影名2',
				'poster': 'http://i1.sinaimg.cn/gm/2014/0415/U10229P115DT20140415134404.jpg'
			},
			{
				'_id': 3,
				'title': '电影名3',
				'poster': 'http://i1.sinaimg.cn/gm/2014/0415/U10229P115DT20140415134404.jpg'
			}
		]
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
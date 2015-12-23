var express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	MovieModel = require('./models/movie.js'),
	port = 3000;

// 连接本地数据库,之后可以从这里抽出来，放到另外一个文件里面去
mongoose.connect('mongodb://localhost/imooc');

var app = express();
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'bower_components')));
app.listen(port);
console.log('server starting');

// 编写路由
// 1. 首页
app.get('/', function(req, res) {

	// 使用mongoose的model，从mongdb获取数据,然后给jade构造视图，然后返回给浏览器
	MovieModel.fetchAll(function(err, movies) {
		res.render('index',{
			title: '首页',
			movies: movies
		});
	});
	// res.render('index', {
	// 	movies: [
	// 		{
	// 			'_id': 1,
	// 			'title': '电影名1',
	// 			'poster': 'http://i1.sinaimg.cn/gm/2014/0415/U10229P115DT20140415134404.jpg'
	// 		},
	// 		{
	// 			'_id': 2,
	// 			'title': '电影名2',
	// 			'poster': 'http://i1.sinaimg.cn/gm/2014/0415/U10229P115DT20140415134404.jpg'
	// 		},
	// 		{
	// 			'_id': 3,
	// 			'title': '电影名3',
	// 			'poster': 'http://i1.sinaimg.cn/gm/2014/0415/U10229P115DT20140415134404.jpg'
	// 		}
	// 	]
	// });
});
// 2.详情页,需要所传参数的定义，与ng类似，如果有多个参数的话，就：/list:id&name&ha
app.get('/detail/:id', function(req, res) {

	var id = req.params.id; // 从url中，获取参数

	// 然后请求数据库的数据，再通过jade来渲染，返回页面
	Movie.findById(id, function(err, movie) {
		res.render('detail', {
			title: '详情页 ' + movie.title ,
			movie: movie
		})
	});

	// res.render('detail', {
	// 	title: '详情页'
	// });
});

// 3.列表页
app.get('/list', function(req, res) {
	res.render('list', {
		title: '列表页'
	});
});

// 4.后台录入页
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: '后台录入页面'
	});
});

// 5. 再录入电影数据的时候，需要提交表单，需要一个请求来处理，然后就需要这个，该请求是post方法
app.post('/admin/movie/create', function(req, res) {
	
});

// test
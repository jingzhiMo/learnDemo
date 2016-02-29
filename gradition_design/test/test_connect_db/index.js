var express = require('express'),
	mongo   = require('mongoose'),
	model   = require('./model');

var User = model.User;

mongo.connect('mongodb://localhost/test');

var app = express();

app.get('/init', function(req, res) {
	var user = new User({
		name: 'testname',
		password: 'testpwd'
	});
	user.save();
	res.send('data init');
});
app.listen(3000);
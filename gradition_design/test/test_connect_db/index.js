var express = require('express'),
	mongo   = require('mongoose'),
	model   = require('./model');

var User = model.User;

mongo.connect('mongodb://localhost/gradition');

var app = express();

app.get('/init', function(req, res) {
	var user = new User({
		name: 'testname2',
		password: 'testpwd3'
	});
	user.save();
	// User.find({name: 'testname', password: 'testpwd'}, function(err, result) {
	// 	if ( err ) {
	// 		console.log('db check error');
	// 		return;
	// 	}
	// 	res.send(result);
	// });
	
});
app.listen(3000, function() {
	console.log('server is running');
});
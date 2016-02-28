var express  = require('express'),
	mongoose = require('mongoose'),
	config   = require('./config');

var app = express();
app.get('/', function(req, res) {
	res.send('hello world');
});

var server = app.listen(3000, function() {
	// var host = server.address().address;
	// var port = server.address().port;

	console.log('server is listening');
});
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.on('open', function() {
	console.log('打开了链接');
});

mongoose.connect('mongodb://127.0.0.1:12345/test');

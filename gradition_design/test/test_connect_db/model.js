var mongo = require('mongoose');

var Schema = mongo.Schema;

var _User = new Schema({
	name: String,
	password: String
});

exports.User = mongo.model('User', _User);
var mongo = require('mongoose');

var Schema = mongo.Schema;

var _Account = new Schema({
	ID: Number,
	phone: Number,
	username: String,
	password: String
});

exports.Account = mongo.model('Account', _Account);
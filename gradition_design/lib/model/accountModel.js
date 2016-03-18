var mongo = require('mongoose');

var Schema = mongo.Schema;

var _Account = new Schema({
	ID: String,
	phone: Number,
	username: String,
	password: String
});

exports.AccountModel = mongo.model('Account', _Account, 'account'); // account 是数据库集合的名称
var mongo = require('mongoose');

var Schema = mongo.Schema;

var _Order = new Schema({
	ID: String,
	goodID: String,
	good: {
		goodCount: Number,
		goodName: String,
		goodDesc: String,
		oldPrice: Number,
		currPrice: Number
	},
	shopID: String,
	accountID: String,
	evalID: String,
	status: Number,
	beginTime: String,
	endTime: String,
	singlePrice: Number,
	sumPrice: Number
});

exports.OrderModel = mongo.model('Order', _Order, 'order'); // good 为集合的名称
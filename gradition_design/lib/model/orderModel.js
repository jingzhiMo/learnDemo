var mongo = require('mongoose');

var Schema = mongo.Schema;

var _Order = new Schema({
	ID: String,
	goodID: String,
	count: Number,
	phone: String,
	good: {
		goodCount: Number,
		goodName: String,
		goodImg: String,
		goodCont: String,
		goodType: Number,
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
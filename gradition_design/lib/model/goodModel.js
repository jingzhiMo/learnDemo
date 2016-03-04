var mongo = require('mongoose');

var Schema = mongo.Schema;

var _Good = new Schema({
	ID: String,
	goodName: String,
	goodDesc: String,
	goodType: Number,
	goodImg: Array,
	oldPrice: Number,
	currPrice:Number,
	tips: {
		startDate: Date,
		endDate: Date,
		useTime: {
			start: String,
			end: String,
			other: Array
		},
		book: Array,
		rule: Array,
		other: Array
	},
	evalID: String,
	shopID: String
});

exports.GoodModel = mongo('Good', _Good, 'good'); // good 为集合的名称
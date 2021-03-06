var mongo = require('mongoose');

var Schema = mongo.Schema;

var _Good = new Schema({
	ID: String,
	goodName: String,
	goodDesc: String,
	goodType: Number,
	goodImg: Array,
	goodCont: String,
	goodCount: Number,
	goodClass: Array,
	oldPrice: Number,
	currPrice: Number,
	tips: {
		startDate: String,
		endDate: String,
		useTime: {
			openTime: String,
			other: String
		},
		book: Array,
		rule: Array,
		other: Array
	},
	points: {
		sum: Number
	},
	evalID: String,
	shopID: String
});

exports.GoodModel = mongo.model('Good', _Good, 'good'); // good 为集合的名称
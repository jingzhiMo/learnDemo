var mongo = require('mongoose');

var Schema = mongo.Schema;

var _Shop = new Schema({
	ID: String,
	shopName: String,
	shopPhone: String,
	shopPlace: String,
	shopImg: Array,
	isChain: Boolean,
	chainID: String,
	evalID: String,
	goodList: [
		{
			goodID: String,
			goodName: String,
			oldPrice: Number,
			currPrice: Number
		}
	],
	points: {
		eat: Number,
		envir: Number,
		service: Number,
		sum: Number
	}
});

exports.ShopModel = mongo.model('Shop', _Shop, 'shop'); // shop 为集合的名称
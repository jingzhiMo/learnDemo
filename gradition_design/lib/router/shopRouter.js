var ShopModel = require('../model/shopModel').ShopModel;

module.exports = {
	add: function(req, res) {
		var params = req.body;

		addNewShop(params, res);
	}
};


/**
 *  =add new shop
 *  @about  添加新的商家
 *
 *  @param  {json}   shopMsg  商家的信息
 *  @param  {object} res      响应处理对象
 */
function addNewShop(shopMsg, res) {
	getShopLen(function(len) {

		var shop = new ShopModel({
			ID: 's-' + len,
			shopName: shopMsg.name,
			shopPlace: shopMsg.place,
			shopPhone: shopMsg.phone,
			shopImg: [],
			isChain: shopMsg.isChain,
			chainID: shopMsg.chainShop,
			goodList: [],
			evalID: '',
			points: {
				eat: 5,
				envir: 5,
				service: 5,
				sum: 5
			}
		});

		shop.save(function(err) {
			if (err) {
				res.status(500).send('mongodb save shop message error');
				return;
			}
			console.log(shop);
			res.redirect('/');
		});
	});
}


/**
 *  =get shop length
 *  @about  获取商店的数量
 *
 *  @param  {function}  fun  获取成功的回调函数
*/
function getShopLen(fun) {
	ShopModel.find({}, function(err, data) {
		if ( err ) {
			res.status(500).send('mongodb get shop length error');
			return;
		}
		else {
			fun(data.length);
		}
	});
}
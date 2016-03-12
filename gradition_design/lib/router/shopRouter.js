var ShopModel = require('../model/shopModel').ShopModel;

module.exports = {
	add: function(req, res) {
		var params = req.body;

		addNewShop(params, res);
	},
	fetch: function(req, res) {
		var params = {
				isNull: true
			},
			query  = req.query;

		for( var val in query ) {
			if ( query.hasOwnProperty(val) ) {
				params[val] = new RegExp(query[val]); // 模糊搜索需要加上正则表达式
				params.isNull = false;
			}
		}
		fetchShop(res, params);
	},
	modify: function(req, res) {
		var params = req.body;

		modifyShop(params, res);
	},
	remove: function(req, res) {
		console.log(req.body);
		res.send({c: 0});
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
			shopImg: shopMsg.shopImg,
			isChain: shopMsg.isChain,
			chainID: shopMsg.chainShop !== 'new' ? shopMsg.chainShop : 's-' + len,
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
			res.send({c: 0});
		});
	});
}


/**
 *  =modify shop
 *  @about  修改商家信息
 *
 *  @param  {json}   shopMsg  商家信息
 *  @param  {object} res      响应处理对象
 */
function modifyShop(shopMsg, res) {
	var query = {
		ID: shopMsg.ID
	};

	ShopModel.update(query, {$set: {
		shopName: shopMsg.name,
		shopPhone: shopMsg.phone,
		shopPlace: shopMsg.place,
		shopImg: shopMsg.shopImg
	}}, function(err, data) {
		if ( err ) {
			console.log('modify shop error: ' + err);
			res.status(500).send('modify shop error');
			return;
		}
		else {
			// console.log(data);
			console.log('success');
			res.send({c: 0});
		}
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


/**
 *  =fetch shop
 *  @about  获取商家
 *
 *  @param  {object} res     响应处理对象
 *  @param  {json}   params  商家的参数，为空则获取全部
 */
function fetchShop(res, params) {
	if ( params.isNull ) { // 判断对象是否为空
		params = {};
	}
	else {
		delete(params.isNull);
	}
	ShopModel.find(params, function(err, data) {
		if ( err ) {
			res.status(500).send('fetch shop msg error');
			return;
		}
		res.send(data);
	});
}
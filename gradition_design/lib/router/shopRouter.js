var ShopModel = require('../model/shopModel').ShopModel;
var GoodModel = require('../model/goodModel').GoodModel;

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
		fetchShop(params, res);
	},
	fetchWithGood: function(req, res) {
		var params = {
			ID: req.query.ID
		};
		fetchShop(params).then(function(shop) {
			fetchGoodByID(shop[0].goodList, res);
		});
	},
	modify: function(req, res) {
		var params = req.body;

		modifyShop(params, res);
	},
	remove: function(req, res) {
		var shopID = req.body.shopID;

		fetchShop({ ID: shopID})
		.then(removeGoodLoop)
		.then(function() {
			removeShop(shopID, res);
		});
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
		len = parseInt((+new Date() / 1000));
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
	var msg = {
		shopName: shopMsg.name,
		shopPhone: shopMsg.phone,
		shopPlace: shopMsg.place,
		shopImg: shopMsg.shopImg
	};
	ShopModel.update(query, {$set: msg}, function(err, data) {
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
 *  @param  {json}   params  商家的参数，为空则获取全部
 *  @param  {object} res     响应处理对象
 */
function fetchShop(params, res) {
	var p = new Promise(function(resolve) {
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
			if ( res ) {
				res.send(data);
			}
			resolve(data);
		});
	});
	
	return p;
}


/**
 *  =fetch good by id
 *  @about  通过商品的id，获取商品信息
 *
 *  @param  {array}  idArr  商品id的数组
 *  @param  {object} res    响应处理对象
 */
function fetchGoodByID(idArr, res) {
	console.log(idArr); //
	res.send({c: 0});
}


/**
 *  =remove good loop
 *  @about  循环删除商品信息
 *
 *  @param  {object}  shop  商品的信息
 */
function removeGoodLoop(shop) {
	var callback = [],
		idArr    = shop[0].goodList,
		len      = idArr.length,
		isSent   = false;

	for( var i = 0; i < len; i++) {
		callback[i] = false;
	}

	var p = new Promise(function(resolve) {
		for ( i = 0; i < len; i++ ) {
			(function(i) {
				GoodModel.remove({ ID: idArr[i].goodID }, function(err) {
					if ( err ) {
						console.log('remove good error in loop');
						return;
					}
					else {
						callback[i] = true;

						if ( callback.indexOf(false) === -1 && !isSent ) {
							isSent = true;
							resolve(true);
							return;
						}
					}
				});
			})(i);
		}
	});

	return p;
}


/**
 *  =remove shop 
 *  @about  删除商店的信息
 *
 *  @param  {string}  shopID  商店的ID
 *  @param  {object}  res     响应处理对象
 */
function removeShop(shopID, res) {
	ShopModel.remove({
		ID: shopID
	}, function(err) {
		if ( err ) {
			console.log('delete shop error');
			res.status(500).send({ c: -1});
			return;
		}
		res.send({c: 0});
	});
}
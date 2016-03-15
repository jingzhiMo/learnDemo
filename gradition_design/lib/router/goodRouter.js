var GoodModel = require('../model/goodModel').GoodModel,
	ShopModel = require('../model/shopModel').ShopModel;

module.exports = {
	add: function(req, res) {
		var params = req.body;

		addNewGood(params, res);
	},
	fetch: function(req, res) {
		var params = {
				isNull: true
			},
			query = req.query;

		for( var val in query ) {
			if ( query.hasOwnProperty(val) ) {
				params[val] = new RegExp(query[val]); // 模糊搜索需要加上正则表达式
				params.isNull = false;
			}
		}
		fetchGood(res, params);
	},
	fetchByID: function(req, res) {
		fetchGoodByID(req.query.ID, res);
	},
	modify: function(req, res) {
		var params = req.body;

		modifyGood(params, res);
	},
	remove: function(req, res) {
		console.log(req.body);
		res.send({c: 0});
	}
};


/**
 *  =add new good
 *  @about  增加新的商品
 *
 *  @param  {json}   goodMsg  商品的信息
 *  @param  {object} res      响应处理对象
 */
function addNewGood(goodMsg, res) {
	
	// getGoodLen(function(len) {
	// 	var good = new GoodModel();

	// 	good.save(function(err) {
	// 		if (err) {
	// 			res.status(500).send('mongodb save good message error');
	// 			return;
	// 		}
	// 		console.log(good);
	// 		res.send({c: 0});
	// 	});
	// });
	getGoodLen()
	.then(function(len) { // 保存商品信息
		var p = new Promise(function(resolve) {
			var good = new GoodModel({
					ID: 'g-' + len,
					goodName: goodMsg.goodName,
					goodDesc: goodMsg.goodDesc,
					goodType: goodMsg.goodType,
					goodCont: goodMsg.goodCont,
					goodCount: 880, // TODO 商品出售数量
					goodImg: goodMsg.goodImg,
					oldPrice: goodMsg.oldPrice,
					currPrice: goodMsg.currPrice,
					tips: {
						startDate: goodMsg.tips.startDate,
						endDate: goodMsg.tips.endDate,
						useTime: {
							openTime: goodMsg.tips.useTime.openTime,
							other: goodMsg.tips.useTime.other
						},
						book: goodMsg.tips.book,
						rule: goodMsg.tips.rule,
						other: goodMsg.tips.other
					},
					points: {
						sum: 5 // TODO 商品的评分
					},
					shopID: goodMsg.shopID,
					evalID: ''
			});
			good.save(function(err) {
				if (err) {
					res.status(500).send('mongodb save good message error');
					return;
				}
				resolve({
					goodID: 'g-' + len,
					shopID: goodMsg.shopID
				});
			});
		});

		return p;
	})
	.then(function(ID) { // 更新商家信息
		var p = new Promise(function(resolve) {

			ShopModel.find({
				ID: ID.shopID
			}, 
			function(err, data) {
				if ( err ) {
					console.log('fetch shop error after save good');
					res.status(500).send({c: -1});
				}
				resolve({
					shopID: ID.shopID,
					goodID: ID.goodID,
					shopMsg: data[0]
					// ID.shopID, ID.goodID, data[0]
				}); // 传商户的信息
			});
		});

		return p;
	})
	.then(function(msg) {
		ShopModel.update(
		{
			ID: msg.shopID
		},
		{$set: {
			goodList: msg.shopMsg.goodList.push({goodID: msg.goodID})
		}
		},
		function(err) {
			if ( err ) {
				console.log('update shop message error');
				res.status(500).send({c: -1});
				return;
			}
			res.send({c: 0});
		});
	});
}


/**
 *  =save good message
 *  @about  保存商品信息
 *
 *  @param  {object}  goodMsg  商品信息
 *  @param  {object}  res      响应处理对象
 */



/**
 *  =modify good message
 *  @about  修改商品的信息
 *
 *  @param  {json}   goodMsg  修改后的商品的信息
 *  @param  {object} res      响应处理对象
 */
function modifyGood(goodMsg, res) {
	var query = {
		ID: goodMsg.ID
	};

	GoodModel.update(query, {$set: goodMsg}, function(err, data) {
		if ( err ) {
			console.log('修改商品信息失败');
			res.status(500).send({c: -1});
			return;
		}
		else {
			console.log('update good success');
			res.send({c: 0});
		}
	});
}


/**
 *  =fetch good
 *  @about  获取商品的信息
 *
 *  @param  {object}  res    响应处理对象
 *  @param  {json}    params 查询的条件
 */
function fetchGood(res, params) {
	if ( params.isNull ) {
		params = {};
	}
	else {
		delete(params.isNull);
	}
	GoodModel.find(params, function(err, data) {

		if ( err ) {
			console.log('fetch good error');
			res.status(500).send({c: -1});
			return;
		}

		var result   = [],
			goodData = data,
			len      = goodData.length > 10 ? 10 : goodData.length,
			callback = [];

		for( var i = 0; i < len; i++) {
			callback[i] = false;
		}

		for( i = 0, len = goodData.length; i < len; i++) {
			// 异步循环不能获取到下标，所以要给个闭包
			(function(i) {
				ShopModel.find({ID: goodData[i].shopID}, function(err, data) {
					if ( err ) {
						console.log('fetch good err by shopID');
						res.status(500).send({c: -1});
					}
					else {
						result.push({
							good: goodData[i],
							shop: data[0]
						});
						callback[i] = true;
						if ( callback.indexOf(false) === -1 ) {
							res.send(result);
							return;
						}
					}
				});
			})(i);
		}
	});
}


/**
 *  =fetch good by id
 *  @about  通过商品的 id 获取商品信息，只返回商品的信息
 *
 *  @param  {string}  goodID  商品的ID
 *  @param  {object}  res     响应处理对象
 */
function fetchGoodByID(goodID, res) {
	var query = {
		ID: goodID
	};

	GoodModel.find(query, function(err, data) {
		if ( err ) {
			console.log('fetch good by id error');
			res.status(500).send({c: -1});
		}
		res.send(data[0]);
	});
}


/**
 *  =get good len
 *  @about  获取商品的数量
 *
 *  @param  {function}  fun  回调函数
 */
function getGoodLen(fun) {
	var p = new Promise(function(resolve) {
		GoodModel.find({}, function(err, data) {
			if ( err ) {
				res.status(500).send('mongodb get good length error');
				return;
			}
			else {
				if ( fun ) {
					fun(data.length);
				}
				resolve(data.length);
			}
		});
	});

	return p;
}


/**
 *  =get shop message by id
 *  @about  通过商家的id，获取商家信息
 *
 *  @param  {string}   shopID  商家的id
 *  @param  {function} fn      回调函数
 *  @param  {number}   idx     查询的下标
 *  @param  {number}   sum     查询的总数
 */
// function getShopMsgById(goodID, fn, idx, sum) {
// 	ShopModel.find({ID: goodID}, function(err, data) {

// 	});
// }


/**
 *  =append good to shop
 *  @about  把商品的ID，添加商店的信息里面
 *
 */
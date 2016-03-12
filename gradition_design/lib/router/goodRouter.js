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
	
	getGoodLen(function(len) {
		var good = new GoodModel({
			ID: 'g-' + len,
			goodName: goodMsg.goodName,
			goodDesc: goodMsg.goodDesc,
			goodType: goodMsg.goodType,
			goodCont: goodMsg.goodCont,
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
			shopID: goodMsg.shopID,
			evalID: ''
		});

		good.save(function(err) {
			if (err) {
				res.status(500).send('mongodb save good message error');
				return;
			}
			console.log(good);
			res.send({c: 0});
		});
	});
}


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
 *  =get good len
 *  @about  获取商品的数量
 *
 *  @param  {function}  fun  回调函数
 */
function getGoodLen(fun) {
	GoodModel.find({}, function(err, data) {
		if ( err ) {
			res.status(500).send('mongodb get good length error');
			return;
		}
		else {
			fun(data.length);
		}
	});
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
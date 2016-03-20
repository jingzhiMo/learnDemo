var OrderModel = require('../model/orderModel').OrderModel;

var goodRouter = require('./goodRouter');

module.exports = {
	fetch: function(req, res) {
		var orderID = req.query.ID;
		orderGetByID(orderID, res);
	},
	add: function(req, res) {
		var goodID    = req.body.goodID,
			shopID    = req.body.shopID,
			count     = req.body.count,
			accountID = req.session.userID,
			currDate  = (+new Date());

		if ( !goodID ) {
			return;
		}

		goodRouter.getGoodByID(goodID)
		.then(function(data) {
			var ID = 'o' + parseInt(currDate / 1000);

			if ( !data ) {
				res.status(500).send({c: -1});
				return;
			}
			orderAdd({
					ID: ID,
					goodID: goodID,
					shopID: shopID,
					count: count,
					phone: req.session.phone,
					good: {
						goodName: data.goodName,
						goodImg: data.goodImg[0],
						goodCont: data.goodCont,
						goodType: data.goodType,
						goodDesc: data.goodDesc,
						oldPrice: data.oldPrice,
						currPrice: data.currPrice
					},
					accountID: req.session.userID,
					evalID: '',
					status: 1,
					beginTime: currDate + '',
					endTime: (currDate + 1000 * 60 * 60 * 24 * 7) + '',
					singlePrice: data.currPrice,
					sumPrice: (count * data.currPrice).toFixed(2)
				})
			.then(function(success) {
				if ( !success ) {
					res.status(500).send({c: -1});
					return;
				}
				res.send({c: 0, ID: ID});
			});
		});
	},
	pay: function(req, res) {
		var ID     = req.body.ID,
			status = req.body.status;

		changeStatus(ID, status)
		.then(function(flag) {
			if ( flag ) {
				res.send({c: 0});
			}
			else {
				res.status(500).send({c: -1});
			}
		});
	},
	fetchByUserID: function(req, res) {
		var userID = req.query.userID || req.session.userID;
		orderGetByUserID(userID, res);
	},
	remove: function(req, res) {
		var idArr = req.body.idArr;

		orderRemove(idArr)
		.then(function(flag) {
			if ( flag ) {
				res.send({c: 0});
			}
			else {
				res.status(500).send({c: -1});
			}
		});
	}
};


/**
 *  =get order
 *  @about  获取订单信息
 *
 *  @param  {string}  orderID  订单的ID
 *  @param  {object}  res      响应处理对象
 */
function orderGetByID(orderID, res) {
	var p = new Promise(function(resolve) {
		OrderModel.find({
			ID: orderID
		}, function(err, data) {
			if ( err ) {
				console.log('fetch order error');
				if ( res ) {
					res.status(500).send({c: -1});
					return;
				}
			}
			if ( res ) {
				res.send(data[0]);
				return;
			}
			resolve(data[0]);
		});
	});

	return p;
}


/**
 *  =get order by userID
 *  @about  获取订单信息
 *
 *  @param  {string}  userID  用户的ID
 *  @param  {object}  res     响应处理对象
 */
function orderGetByUserID(userID, res) {
	var p = new Promise(function(resolve) {
		OrderModel.find({
			accountID: userID
		}, function(err, data) {
			if ( err ) {
				console.log('fetch order error');
				if ( res ) {
					res.status(500).send({c: -1});
					return;
				}
			}
			if ( res ) {
				res.send(data);
				return;
			}
			resolve(data);
		});
	});

	return p;
}


/**
 *  =add order
 *  @about  增加订单信息
 *
 *  @param  {object}  orderMsg  订单的一些信息，需要补全
 *  
 */
function orderAdd(orderMsg) {
	var p = new Promise(function(resolve) {
		var order = new OrderModel(orderMsg);

		order.save(function(err) {
			if ( err ) {
				console.log('save order error');
				resolve(false);
				return;
			}
			resolve(true);
		});
	});

	return p;
}


/**
 *  =order remove
 *  @about  删除订单信息
 *
 *  @param  {array}  idArr  订单ID的数组
 */
function orderRemove(idArr) {
	var p = new Promise(function(resolve) {
		var callback = [],
			isSent = false;

		for(var i = 0, len = idArr.length; i < len; i++ ) {
			callback[i] = false;
		}

		for( i = 0; i < len; i++ ) {
			(function(i) {
				OrderModel.remove({
					ID: idArr[i]
				}, function(err) {
					if ( err ) {
						console.log('remove order error');
						if ( !isSent ) {
							isSent = true;
							resolve(false);
						}
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
 *  =change status
 *  @about  改变状态
 *
 *  @param  {string}  ID     订单的ID
 *  @param  {number}  status 订单即将改变的状态
 */
function changeStatus(ID, status) {
	var p = new Promise(function(resolve) {
		OrderModel.update({
			ID: ID
		}, {$set: {
			status: status
		}},
		function(err) {
			if ( err ) {
				console.log('update order status error');
				resolve(false);
				return;
			}
			resolve(true);
		});
	});

	return p;
}
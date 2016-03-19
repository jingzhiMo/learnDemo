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
			addOrder({
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
					sumPrice: count * data.currPrice
				})
			.then(function(success) {
				if ( !success ) {
					res.status(500).send({c: -1});
					return;
				}
				res.send({c: 0, ID: ID});
			});
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
 *  =add order
 *  @about  增加订单信息
 *
 *  @param  {object}  orderMsg  订单的一些信息，需要补全
 *  
 */
function addOrder(orderMsg) {
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
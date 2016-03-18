var OrderModel = require('../model/orderModel').OrderModel;

var goodRouter = require('./goodRouter');

module.exports = {
	add: function(req, res) {
		var goodID    = req.body.goodID,
			shopID    = req.body.shopID,
			count     = req.body.count,
			accountID = req.session.userID;

		console.log('haha');
		res.send({c: 0});

		goodRouter.getGoodByID(goodID)
		.then(function(data) {
			var currDate = (+new Date());

			if ( !data ) {
				res.status(500).send({c: -1});
				return;
			}
			addOrder({
				ID: 'o' + parseInt(currDate / 1000),
				goodID: goodID,
				shopID: shopID,
				good: {
					goodName: data.goodName,
					goodDesc: data.goodDesc,
					goodCount: data.goodCount,
					oldPrice: data.oldPrice,
					currPrice: data.currPrice
				},
				accountID: accountID,
				evalID: '',
				status: 1,
				beginTime: currDate + '',
				endTime: (currDate + 1000 * 60 * 60 * 24 * 7) + '',
				singlePrice: good.currPrice,
				sumPrice: count * good.currPrice
			})
			.then(function(success) {
				if ( !success ) {
					res.status(500).send({c: -1});
					return;
				}
				res.send({c: 0});
			});
		});
	}
};


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
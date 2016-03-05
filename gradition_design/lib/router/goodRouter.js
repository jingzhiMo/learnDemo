var GoodModel = require('../model/goodModel').GoodModel;

module.exports = {
	add: function(req, res) {
		var params = req.body;

		// console.log(params);
		addNewGood(params, res);
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
			goodImg: [], // TODO
			oldPrice: goodMsg.oldPrice,
			currPrice: goodMsg.currPrice,
			tips: {
				startDate: goodMsg.tips.startDate,
				endDate: goodMsg.tips.endDate,
				useTime: {
					openTime: goodMsg.openTime,
					other: goodMsg.timeTip,
				},
				book: goodMsg.book,
				rule: goodMsg.rule,
				other: goodMsg.other
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
var EvalModel = require('../model/evalModel').EvalModel;

module.exports = {
	add: function(req, res) {
		var date = +(new Date());
			evalMsg = {
				ID: 'e-' + parseInt(date / 1000),
				goodID: req.body.goodID,
				shopID: req.body.shopID,
				orderID: req.body.orderID,
				accountID: req.session.userID,
				cont: {
					username: req.session.username,
					date: date + '',
					points: {
						eat: req.body.cont.points.eat,
						envir: req.body.cont.points.envir,
						service: req.body.cont.points.service,
						sum: req.body.cont.points.sum
					},
					imgList: req.body.cont.imgList,
					word: req.body.cont.word
				}
			};
		console.log(evalMsg);
		addEval(evalMsg).then(function(flag) {
			if ( flag ) {
				res.send({c: 0});
				return;
			}
			else {
				res.status(500).send({c: -1});
			}
		});
	}
};


/**
 *  =add evaluate
 *  @about  增加订单
 *
 *  @param  {object}  evalMsg  订单的信息
 */
function addEval(evalMsg) {
	var p = new Promise(function(resolve) {
		var evalObj = new EvalModel(evalMsg);

		evalObj.save(function(err) {
			if ( err ) {
				console.log('save eval error');
				resolve(false);
				return;
			}
			resolve(true);
		});
	});

	return p;
}
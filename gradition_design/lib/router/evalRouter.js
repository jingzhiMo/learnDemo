var EvalModel = require('../model/evalModel').EvalModel;
var OrderRouter = require('./orderRouter');

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
		addEval(evalMsg)
		.then(OrderRouter.changeStatus)
		.then(function(flag) {
			if ( flag ) {
				res.send({c: 0});
				return;
			}
			else {
				res.status(500).send({c: -1});
			}
		});
	},
	fetch: function(req, res) {
		var _val = req.query.ID || req.query.goodID || req.query.shopID,
			param = {},
			_key;

		if ( req.query.ID ) {
			_key = 'ID';
		}
		else if ( req.query.goodID ) {
			_key = 'goodID';
		}
		else if ( req.query.shopID ) {
			_key = 'shopID';
		}

		param[_key] = _val;
		getEval(param)
		.then(function(data) {
			if ( data.length === undefined ) {
				res.status(500).send({c: -1});
				return;
			}
			res.send(data);
		});
	}
};


/**
 *  =add evaluate
 *  @about  增加评价
 *
 *  @param  {object}  evalMsg  评价的信息
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
			resolve({
				ID: evalMsg.orderID,
				status: 3
			});
		});
	});

	return p;
}


/**
 *  =get evaluate
 *  @about  获取评价
 *
 *  @param  {object}  查询的ID，有可能是goodID, shopID, ID
 */
function getEval(param) {
	var p = new Promise(function(resolve) {
		EvalModel.find(param, function(err, data) {
			if ( err ) {
				console.log('get eval error');
				resolve(false);
				return;
			}
			else {
				resolve(data);
			}
		});
	});

	return p;
}
var goodRouter = require('./goodRouter'),
	shopRouter = require('./shopRouter');

module.exports = {
	search: function(req, res) {
		var key = req.query.key,
			result = {};

		goodRouter.getGoodByOther({goodName: key})
		.then(function(data) {
			var p = new Promise(function(resolve) {
				result.good = data.length > 5 ? data.slice(0, 5) : data;
				resolve({shopName: req.query.key});
			});
			return p;
		})
		.then(shopRouter.getShopByOther)
		.then(function(data) {
			var p = new Promise(function(resolve) {
				result.shop = data.length > 5 ? data.slice(0, 5) : data;
				resolve({goodClass: key});
			});

			return p;
		})
		.then(goodRouter.getGoodByOther)
		.then(function(data) {
			result.class = data.length > 5 ? data.slice(0, 5) : data;
			res.send(result);
		});
	}
};
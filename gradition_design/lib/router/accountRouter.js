var AccountModel = require('../model/accountModel').AccountModel;

module.exports = {
	login: function(req, res) {
		var params = req.query; // 获取传过来的参数

		AccountModel.find(
			{
				phone: params.phone,
				password: params.password
			}, 
			function(err, data) {
				accountLogin(err, data, res);
			}
		);
	},
	register: function(req, res) {

	}
};

/**
 *  =account login
 *  @about    用户请求登录，查询数据，返回结果
 *
 *  @param   {object}  err      查询出错
 *  @param   {string}  data     查询的结果
 *  @param   {object}  res      响应处理对象
 */
function accountLogin(err, data, res) {
	var result;

	if ( err ) { // 查询数据库出错
		result = {c: -500};
	}
	else if ( data.length ){ // 有该用户
		result = {c: 0};
	}
	else { // 没有该用户
		result = {c: -404};
	}
	res.send(JSON.stringify(result));
}
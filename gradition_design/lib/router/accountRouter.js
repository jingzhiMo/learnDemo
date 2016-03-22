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
				accountLogin(err, data, req, res);
			}
		);
	},
	logout: function(req, res) {
		req.session.phone = undefined;
		req.session.userID = undefined;
		req.session.username = undefined;
		req.session.isOnline = undefined;
		res.send({c: 0});
	},
	register: function(req, res) {
		checkNewAccount(req.body.phone, function(code) {
			if ( code < 0 ) {
				res.status(500).send('mongodb find error');
			}
			else if ( code === 0 ) { // 不存在该用户
				calcAccountLen( function(ID) {

					addNewAccount({
						ID: ID,
						phone: req.body.phone,
						username: req.body.username,
						password: req.body.password
					}, req, res);
					
				});
			}
			else {
				res.send({
					c: 0,
					ise: 1
				});
			}
		});
	},
	checkNewAccount: function(req, res) {
		checkNewAccount(req.query.phone, function() {}, res);
	},
	fetch: function(req, res) {
		var ID = req.session.userID;
		getUserMsg(ID)
		.then(function(data) {
			if ( !data ) {
				res.status(500).send({c: -1});
				return;
			}
			res.send(data);
		});
	}
};

/**
 *  =account login
 *  @about    用户请求登录，查询数据，返回结果
 *
 *  @param   {object}  err      查询出错
 *  @param   {string}  data     查询的结果
 *  @param   {object}  req      请求处理对象
 *  @param   {object}  res      响应处理对象
 */
function accountLogin(err, data, req, res) {
	var result;

	if ( err ) { // 查询数据库出错
		result = {c: -500};
	}
	else if ( data.length ){ // 有该用户
		req.session.phone = data[0].phone;
		req.session.userID = data[0].ID;
		req.session.username = data[0].username;
		req.session.isOnline = 1;
		result = {c: 0};
	}
	else { // 没有该用户
		result = {c: -404};
	}
	res.send(result);
	return;
}


/**
 *  =check new account
 *  @about    查询是否是新用户
 *
 *  @param    {string}   phone  用户注册的手机号
 *  @param    {function} fun    回调函数
 *  @param    {object}   res    响应处理对象
 */
function checkNewAccount(phone, fun, res) {
	AccountModel.find(
		{
			phone: phone
		}, 
		function(err, data) {
			var code, result;

			if ( err ) {
				code = -500;
				result = {
					c: -500
				};
			}
			else if ( data.length ){ // 存在这个用户
				code = 1;
				result = {
					c: 0,
					ise: 1
				};
			}
			else {
				code = 0;
				result = {
					c: 0,
					ise: 0
				};
			}

			// 执行回调函数，需要响应的话，就把响应结果返回
			fun(code);
			if ( res ) {
				res.send(result);
			}
		}
	);
}


/**
 *  =add new account
 *  @about    添加新用户
 *
 *  @param    {object}  accountMsg
 *  		  ID:       新用户的ID
 *            phone:    新用户的手机号
 *            password: 新用户的密码
 *  @param    {object}  req  请求处理对象
 *  @param    {object}  res  响应处理对象
 */
function addNewAccount(accountMsg, req, res) {
	// TODO
	var account = new AccountModel(accountMsg);
	account.save(function(err) {
		if ( err ) {
			res.status(500).send('mongodb save message error');
			return;
		}
		req.session.phone = accountMsg.phone;
		req.session.userID = accountMsg.ID;
		req.session.username = accountMsg.username;
		req.session.isOnline = 1;
		res.send({
			c: 0,
			token: '1'
		});
	});
}


/**
 *  =calulate account
 *  @about    计算用户的数量
 *
 *  @param    {function}  fun  计算成功后调用的函数
 */
function calcAccountLen(fun) {
	AccountModel.find({}, function(err, data) {
		if ( err ) {
			console.log('计算用户数量出错');
			res.status(500).send();
			return;
		}
		// fun(data.length);
		// 原来是使用用户的长度来定位用户的ID，但是这样会重复，所以还是使用时间戳作为ID
		var id = 'u-' + parseInt((+new Date() / 1000));
		fun(id);
	});
}


/**
 *  =get user msg
 *  @about  获取用户信息
 *
 *  @param  {string}  userID  用户的ID
 */
function getUserMsg(userID) {
	var p = new Promise(function(resolve) {
		AccountModel.find({
			ID: userID
		}, function(err, data) {
			if ( err ) {
				console.log('get user message error');
				resolve(false);
				return;
			}
			resolve(data[0]);
		});
	});

	return p;
}
var parser = require('body-parser');
var accountRouter = require('./accountRouter');

module.exports = function(app) {
	app.get('/login', accountRouter.login)             				  // 登录处理
	   .get('/checkNewAccount', accountRouter.checkNewAccount)        // 检查是否新用户处理
	   .post('/register', parser.json(), accountRouter.register);     // 注册处理
};
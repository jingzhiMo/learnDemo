var accountRouter = require('./accountRouter');

module.exports = function(app) {
	app.get('/login', accountRouter.login)        // 登录处理
	   .post('/register', accountRouter.register); // 注册处理
};
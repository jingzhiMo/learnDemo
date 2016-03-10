var parser = require('body-parser'),
	multipart  = require('connect-multiparty');
var accountRouter = require('./accountRouter'),
	shopRouter    = require('./shopRouter'),
	goodRouter    = require('./goodRouter'),
	uploadRouter  = require('./uploadRouter');

module.exports = function(app) {
	app.get('/login', accountRouter.login)             				  // 登录处理
	   .get('/checkNewAccount', accountRouter.checkNewAccount)        // 检查是否新用户处理
	   .post('/register', parser.json(), accountRouter.register)      // 注册处理
	   // .post('/shopAdd', multipart(), shopRouter.add)              // 增加商家
	   .post('/shopAdd', parser.json(), shopRouter.add)   			  // 增加商家(json)
	   .post('/shopModify', parser.json(), shopRouter.modify)         // 修改商家信息
	   .get('/shopFetch', shopRouter.fetch)                           // 获取商家
	   .post('/goodAdd', parser.json(), goodRouter.add)               // 增加商品
	   .post('/upload/img', uploadRouter.upload);   				  // 上传图片
};

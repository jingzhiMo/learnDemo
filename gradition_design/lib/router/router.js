var parser = require('body-parser'),
	multipart  = require('connect-multiparty');
var accountRouter = require('./accountRouter'),
	shopRouter    = require('./shopRouter'),
	goodRouter    = require('./goodRouter'),
	uploadRouter  = require('./uploadRouter'),
	orderRouter   = require('./orderRouter'),
	evalRouter    = require('./evalRouter');

module.exports = function(app) {
	app.get('/login', accountRouter.login)             				  // 登录处理
	   .post('/logout', accountRouter.logout)             			  // 退出
	   .get('/checkNewAccount', accountRouter.checkNewAccount)        // 检查是否新用户处理
	   .post('/modifyAccount', parser.json(), accountRouter.modify)   // 修改用户信息
	   .post('/register', parser.json(), accountRouter.register)      // 注册处理
	   .post('/shopAdd', parser.json(), shopRouter.add)   			  // 增加商家(json)
	   .post('/shopModify', parser.json(), shopRouter.modify)         // 修改商家信息
	   .post('/shopDelete', parser.json(), shopRouter.remove)         // 删除商家
	   .get('/shopFetch', shopRouter.fetch)                           // 获取商家
	   .get('/shopFetchWithGood', shopRouter.fetchWithGood)           // 获取商家还有商品的信息
	   .post('/goodAdd', parser.json(), goodRouter.add)               // 增加商品
	   .post('/goodModify', parser.json(), goodRouter.modify)         // 修改商品信息
	   .post('/goodDelete', parser.json(), goodRouter.remove)         // 删除商品
	   .get('/goodFetch', goodRouter.fetch)                           // 获取商品
	   .get('/purchase', goodRouter.purchase)                         // 商品购买
	   .post('/orderAdd', parser.json(), orderRouter.add)             // 订单增加
	   .get('/orderFetchByUserID', orderRouter.fetchByUserID)         // 订单查询
	   .get('/orderFetch', orderRouter.fetch)    		              // 订单查询
	   .post('/orderPay', parser.json(), orderRouter.pay)             // 订单付款
	   .post('/orderDelete', parser.json(), orderRouter.remove)       // 订单删除
	   .post('/evalAdd', parser.json(), evalRouter.add)               // 添加评价
	   .get('/evalFetch', evalRouter.fetch)                           // 获取评论
	   .get('/userFetch', accountRouter.fetch)                        // 获取用户信息
	   .post('/upload/img', uploadRouter.upload);    				  // 上传图片
};

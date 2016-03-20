var mongo = require('mongoose');

var Schema = mongo.Schema;

var _Eval = new Schema({
	ID: String,
	goodID: String, // 评价该商品的ID
    shopID: String, // 评价该商家的ID
    orderID: String, // 评价的订单的ID
    accountID: String, // 评价者的ID
    cont: {
        username: String, // 用户名 string
        date: String, // 时间戳 string
        points: { // 分数 object
            eat: Number, // 口味的分数
            envir: Number, // 环境的分数
            service: Number, // 服务的分数
            sum: Number // 综合评分
        },
        imgList: Array, // 图片的列表
        word: String // 评论内容 strng
    }
});

exports.EvalModel = mongo.model('Eval', _Eval, 'evaluate'); // eval 是数据库集合的名称
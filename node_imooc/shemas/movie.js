var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	flash: String,
	poster: String,
	year: Number,
	meta: { // 更新（操作）数据的时候，时间的记录
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

// 为这个模式添加方法
/*
 * 每次在存储数据之前，都会调用这个方法
 */
MovieSchema.pre('save', function(next) {

	// 判断这个数据是不是新的，就是判断是更新还是新插入的数据
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	next(); // 要执行next才会把数据存到数据库里面 
});

/*
 * 添加一系列的静态方法
 */
MovieSchema.statics = {
	// 获取所有的数据
	fetchAll: function(cb) {
		return this
				.find({})
				.sort('meta.updateAt') // 按照更新时间排序
				.exec(cb);   		   // 执行回调
	},
	// 通过id，查询到一个数据
	fetchById: function(id, cb) {
		return this
				.findOne({_id: id})	// 使用原始方法查询
				.exec(cb);			// 执行回调
	}
};

// 暴露schema给外面使用
module.exports = MovieSchema;
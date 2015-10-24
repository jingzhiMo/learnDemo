var mongoose = require('mongoose'),
	MovieSchema = require('../schemas/movie');

// 生成模型
var Movie = mongoose.model('Movie', MovieSchema);

// 导出
module.exports = Movie;
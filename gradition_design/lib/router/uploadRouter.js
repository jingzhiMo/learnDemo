var fs = require('fs'),
    formidable = require('formidable'),
    util = require('util');

module.exports = {
	upload: function(req, res) {
		var form = new formidable.IncomingForm();
		//设置编辑
		form.encoding = 'utf-8';
		//设置文件存储路径
		form.uploadDir = "./uploads/images";
		//保留后缀
		form.keepExtensions = true;
		//设置单文件大小限制    
		form.maxFieldsSize = 2 * 1024 * 1024;
		//form.maxFields = 1000;  设置所以文件的大小总和

		form.parse(req, function(err, fields, files) {

		    var source = files.upload.path,
		        arr = files.upload.name.split('.'),
		        len = arr.length,
		        name = arr[0] + (+new Date() / 1000 + '.') + arr[len - 1],
		        target = './uploads/images/' + name,
		        realPath = '/images/' + name;

		    fs.rename(source, target, function(err) {
		        if ( err ) {
		            console.log('rename error');
		            res.status(500).send('rename file error');
		        }
		        else {
		            console.log('rename success');
		            res.send({filepath: realPath});
		        }
		    });
		});
	}
};
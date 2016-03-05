var express = require('express'),
    fs = require('fs'),
    formidable = require('formidable'),
    util = require('util');

var app = express();

app.use(express.static('uploadImg.html'));

app.post('/upload/img', function(req, res) {
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

        var haha = {fields: fields, files: files};

        var source = files.upload.path,
            arr = files.upload.name.split('.'),
            len = arr.length,
            name = arr[0] + '123.' + arr[len - 1],
            target = './uploads/images/' + name;
        fs.rename(source, target, function(err) {
            if ( err ) {
                console.log('rename error');
            }
            else {
                console.log('rename success');
            }
        });
        console.log(target);

        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
      });
});

app.get('/', function(req, res) {
  res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload/img" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
});


app.listen(3000, function() {
  console.log('sever is running');
});




// var express = require('express');
// var router = express.Router();
// var fs = require('fs');
// var formidable = require("formidable");
// /* GET home page. */
// router.get('/', function(req, res) {
//     res.render('index', {
//         title: 'haha'
//     });
// });
// router.post('/', function(req, res) {
//     var form = new formidable.IncomingForm();
//     form.uploadDir = "./public/upload/temp/"; //改变临时目录
//     form.parse(req, function(error, fields, files) {
//         for (var key in files) {
//             var file = files[key];
//             var fName = (new Date()).getTime();
//             switch (file.type) {
//                 case "image/jpeg":
//                 fName = fName + ".jpg";
//                 break;
//                 case "image/png":
//                 fName = fName + ".png";
//                 break;
//                 default:
//                 fName = fName + ".png";
//                 break;
//             }
//             console.log(file, file.size);

//             var uploadDir = "./public/upload/" + fName;
//             fs.rename(file.path, uploadDir, function(err) {
//                 if (err) {
//                     res.write(err + "n");
//                     res.end();
//                 }
//                 //res.write("upload image:<br/>");
//                 res.write("<img src='/upload/" + fName + "' />");
//                 res.end();
//             })
//         }
//     });
// });
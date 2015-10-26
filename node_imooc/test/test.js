var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

mongoose.connect('mongodb://localhost:12345/imooc');

//声明Schema
var nodeSchema = new Schema({
    name: String,
    age: Number
});
//构建model
var Node = mongoose.model('Node', nodeSchema);
//简单的数据交互
//创建两个实例
var node = new Node({name: 'kevin', age: '22'});
node.save(function(err){
    if(err){
        console.log(err);
    }else{
        // console.log('The new node is saved');
        Node.find({});
    }
});


// console.log(nodeSchema);
// console.log(Node);
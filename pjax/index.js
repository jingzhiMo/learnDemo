'use strict';
/**
 *  @author mojingzhi.mail@gmail.com
 */
let express = require('express');

let pjaxFilter = require('./filter/pjax');

let app = express();

app.use(express.static('view'));


let server = app.listen(3000, function() {
    console.log('listen:3000');
});

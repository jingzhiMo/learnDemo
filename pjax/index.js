'use strict';
/**
 *  @author mojingzhi.mail@gmail.com
 */
let express = require('express');

let pjaxFilter = require('./filter/pjax'),
    reqPath = require('./requestPath.json');

let app = express();

app
    // .use(express.static('views'))
    .use(express.static('bower_components'))
    .use(express.static('lib'))
    .use(pjaxFilter);


let server = app.listen(3001, function() {
    console.log('listen:3001');
});



app
.get('/', function(req, res, next) {
    console.log('index');
    res.sendFile('views/index.html', {root: __dirname });
})

.get('/rank*', function(req, res, next) {
    var childUrl = req.url.split('/rank')[1].split('?')[0];

    switch(childUrl) {
        default:
        case '/index':
            rankIndex(req, res, next);
        break;

        case '/float':
            rankFloat(req, res, next);
        break;

        case '/snapshotLists':
            rankSnapshotLists(req, res, next);
        break;
    }
});


function rankIndex(req, res, next) {
    // 返回局部页面数据
    let p = /<child><\/child>/;
    if ( req.query.pjax === true ) {
        let rank = require('./views/rank.js')(),
            rankIndex = require('./views/rank_index.js')();
        res.send(rank.replace(p, rankIndex));
    }
    // 返回整个页面
    else {
        let index = require('./views/index.js')(),
            rank = require('./views/rank.js')(),
            rankIndex = require('./views/rank_index.js')();

        let result = index.replace(p, rank).replace(p, rankIndex);
        res.send(result);
    }
}
function rankFloat(req, res, next) {
    // 返回局部页面数据
    let p = /<child><\/child>/;
    if ( req.query.pjax === true ) {
        let rank = require('./views/rank.js')(),
            rankFloat = require('./views/rank_float.js')();
        res.send(rank.replace(p, rankFloat));
    }
    // 返回整个页面
    else {
        let index = require('./views/index.js')(),
            rank = require('./views/rank.js')(),
            rankFloat = require('./views/rank_float.js')();

        let result = index.replace(p, rank).replace(p, rankFloat);
        res.send(result);
    }
}

function rankSnapshotLists(req, res, next) {
    let p = /<child><\/child>/;
    // 返回局部页面数据
    if ( req.query.pjax === true ) {
        let rank = require('./views/rank.js')(),
            rankSnapshotLists = require('./views/rank_snapshotLists.js')();
        res.send(rank.replace(p, rankSnapshotLists));
    }
    else {
        let index = require('./views/index.js')(),
            rank = require('./views/rank.js')(),
            rankSnapshotLists = require('./views/rank_snapshotLists.js')();

        let result = index.replace(p, rank).replace(p, rankSnapshotLists);
        res.send(result);
    }
}

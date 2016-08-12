'use strict';
module.exports = function() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>这是首页</title>
            <style>

            </style>
        </head>
        <body>
            <p>这是顶部的公共部分</p>
            <a href="/rank">跳转去/rank</a><br>
            <a href="/rank/index">跳转去/rank/index</a><br>
            <a href="/rank/float">跳转去/rank/float</a><br>
            <a href="/rank/snapshotLists?a=1&b=2">跳转去/rank/snapshotLists</a><br>
            <hr>
            <p>这是公共部分</p>
            <div id="pjax-container">
                <child></child>
            </div>
            <script src="/jquery.min.js"></script>
            <script src="/jquery-pjax/jquery.pjax.js"></script>
            <script>
                $(document).pjax('a', '#pjax-container');
            </script>
        </body>
        </html>

    `;
};

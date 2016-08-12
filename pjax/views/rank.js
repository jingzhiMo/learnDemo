'use strict';
module.exports = function() {
    var str = `
        <section class="nav">
            <button class="nav-item">实时排名</button>
            <button class="nav-item">更新检测</button>
        </section>
        <child></child>
        <footer>
            <p>这是底部的描述</p>
        </footer>
    `;
    return str;
};

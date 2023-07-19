# @webpart/stat

统计开发阶段中的文件信息和用 CMD 模式定义的模块信息。


`npm install @webpart/stat`

``` javascript

const { Module, HTML, } = require('@webpart/stat');
let dir = './htdocs/';

//分析统计出最原始的文件信息和模块信息。
let file$info = Module.parse(dir, {
     defines: [
        'define',
        'define.panel',
        'define.view',
        'KISP.panel',
        'KISP.view',
    ],

    patterns: [
        'data/**/*.js',
        'lib/**/*.js',
        'modules/**/*.js',
        'views/**/*.js',
    ],

    excludes: [ ],
});


let html$info = HTML.parse(dir, {
    //用来提取出引用了 html 片段文件的标签的正则表达式。
    link: /<link\s+.*rel\s*=\s*["\']html["\'].*\/>/ig,

    //用来提取 panel 或者 view 关联模块的选择器。
    selectors: [
        '[data-view]',
        '[data-panel]',
    ],

    patterns: [
        'lib/**/*.html',
        'modules/**/*.html',
        'views/**/*.html',
    ],

    excludes: [],
});


```


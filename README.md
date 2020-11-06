# @webpart/stat

统计开发阶段中的文件信息和用 CMD 模式定义的模块信息。


`npm install @webpart/stat`

``` javascript

const stat = require('@webpart/stat');

/**
* 统计文件和用 CMD 模式定义的模块信息。
* @param {Object} opt 选项参数。
*   其中： (dir, patterns, excludes) 用来组成模式匹配进行模糊搜索得到文件列表。
*   file、files、(dir, patterns, excludes) 三者的结果会合并成一个大的文件名数组作为最终要处理的文件列表。
*   opt = {
*       file: '',       //可选，要统计的单个文件。
*       files: [],      //可选，要统计的多个文件的数组。
*       dir: '',        //可选，使用模式匹配时要搜索的目录。
*       patterns: [],   //可选，使用模式匹配时要搜索的模式列表。
*       excludes: [],   //可选，使用模式匹配时要排除的模式列表。
*       defines: [],    //可选，针对要解析的模块时，模块的定义方式。
*   };
*/
let infos = stat({
    dir: './htdocs/',

    patterns: [
        'data/**/*.js',
        'lib/**/*.js',
        'modules/**/*.js',
        'views/**/*.js',
        'index.js',
    ],

    defines: [
        'define',
        'define.panel',
        'define.view',
        'KISP.panel',
        'KISP.view',
    ],

});

console.log(infos);



```


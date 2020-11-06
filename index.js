
const fs = require('fs');
const Patterns = require('@definejs/patterns');
const File = require('@definejs/file');
const Encoding = require('./modules/Encoding');
const Module = require('./modules/Module');



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
module.exports = function (opt) { 
    let { file, files, dir, patterns, excludes, defines, } = opt;
    
    let all = [];

    if (file) {
        all = [...all, file,];
    }

    if (files) {
        all = [...all, ...files,];
    }

    if (patterns) {
        let args = dir ? [dir, patterns, excludes,] : [patterns, excludes,];
        let list = Patterns.getFiles(...args);

        all = [...all, ...list,];
    }
    

    let infos = all.map((file) => {
        let content = File.read(file);
        let stat = fs.statSync(file);

        let isUTF8 = Encoding.isUTF8(content);
        let modules = Module.parse(content, defines);

        // if (!isUTF8) {
        //     console.log('非 UTF8 编码的文件：', file);
        // }

        return {
            'file': file,
            'isUTF8': isUTF8,
            'size': stat.size,
            'content': content,
            'modules': modules,
        };

    });

    return infos;
};






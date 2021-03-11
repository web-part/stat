
const Fn = require('@definejs/fn');
const $String = require('@definejs/string');
const Sample = require('./Define/Sample');


module.exports = {

    /**
    * 从指定的 js 内容中解析出 CMD 具名模块的信息。
    * @param {*} content 要解析的 js 内容。
    * @param {*} defines 定义模块所使用的函数（方法）列表。
    * @returns {Array} 返回具名模块的信息列表。
    */
    parse(content, defines) { 
        //去重。
        defines = defines || [];
        defines = [...new Set(defines)];

        if (!defines.length) {
            return [];
        }

        //根据模块定义函数列表，生成用于抽取模块信息的动态代码模板。
        let sample = Sample.get(defines);

        let code = $String.format(sample, {
            'content': content,
        });

        try {
            let list = Fn.exec(code);

            return list;
        }
        catch (ex) {
            return [];
        }
       
    },
};
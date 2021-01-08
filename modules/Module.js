
const Lines = require('@definejs/lines');
const Files = require('../lib/Files');
const Parser = require('./Module/Parser');



module.exports = {

    /**
    * 分析统计文件以及用 CMD 模式定义的模块信息。
    * @param {string} baseDir 基目录。 一般是 `htdocs`。
    * @param {Object} opt 
    */
    stat(baseDir, opt) {

        let { defines, patterns, excludes, } = opt;

        let infos = Files.stat(baseDir, patterns, excludes, function (info, index) {
            let { content, } = info;
            let modules = Parser.parse(content, defines);

            modules.forEach((module) => {
                let { factory, } = module;
                let lines = Lines.split(factory.content);

                //扩展一些字段。
                factory.lines = lines.length;
            });

            //增加字段。
            return {
                ...info,
                modules,
            };
        });

       
        return infos;

    },

};
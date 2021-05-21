
const Lines = require('@definejs/lines');
const Files = require('../lib/Files');
const Define = require('./Module/Define');
const Require = require('./Module/Require');


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
            let modules = Define.parse(content, defines);

            

            modules.forEach((module) => {
                let { factory, } = module;
                let { content, } = factory;
                let lines = Lines.split(content);
                let requires = Require.parse(content);


                //扩展一些字段。
                factory.lines = lines.length;
                module.requires = requires;
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
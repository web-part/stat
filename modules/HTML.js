const Files = require('../lib/Files');
const Panel = require('./HTML/Panel');
const Link = require('./HTML/Link');



module.exports = {


    /**
    * 分析统计。
    * @param {*} baseDir 基目录。 一般是 `htdocs`。
    * @param {*} opt 
    */
    stat(baseDir, opt) {

        let { patterns, excludes, selectors, link, } = opt;
       

        let infos = Files.stat(baseDir, patterns, excludes, function (info, index) {
            let { dir, content, } = info;

      
            let links = Link.parse(content, {
                'cwd': dir,
                'regexp': link,
            });

            let modules = Panel.parse(content, selectors);

            //增加字段。
            return {
                ...info,

                modules,
                links,
            };
        });

        return infos;

    },

    
};
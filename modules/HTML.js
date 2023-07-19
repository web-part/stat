const Files = require('../lib/Files');
const Panel = require('./HTML/Panel');
const Link = require('./HTML/Link');



module.exports = {


    /**
    * 分析。
    * @param {*} baseDir 基目录。 一般是 `htdocs`。
    * @param {*} opt 
    */
    parse(dir, { regexp, selectors, patterns, }) {

        let file$info = Files.readDir(dir, patterns);

        Object.entries(file$info).forEach(([file, info]) => { 
            let { content, } = info;
            let links = Link.parse(content, { dir, file, regexp, });
            let modules = Panel.parse(content, selectors);

            Object.assign(info, {
                content: undefined, //内容就不要返回了，否则数据量太大。
                links,
                modules,
            });

        });



        return file$info;

    },

    
};
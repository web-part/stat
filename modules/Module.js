
const Files = require('../lib/Files');
const Define = require('./Module/Define');
const Require = require('./Module/Require');
const Factory = require('./Module/Factory');


module.exports = {

    /**
    * 分析文件以及用 CMD 模式定义的模块信息。
    */
    parse(dir, { defines, patterns, }) {
        let file$info = Files.readDir(dir, patterns);

        Object.entries(file$info).forEach(([file, info]) => {
            let { content, } = info;
            let modules = Define.parse(content, defines);

            modules.forEach((module) => {
                let { factory, } = module;
                let { beginNo, endNo, length, byteLength, } = Factory.getLineNos(content, factory);

                module.requires = Require.parse(factory, beginNo);

                //扩展一些字段。
                Object.assign(module.factory, {
                    content: undefined, //不要返回 content。
                    beginNo, endNo, length, byteLength,
                });
            });

            Object.assign(info, {
                content: undefined, //内容就不要返回了，否则数据量太大。
                modules,
            });

        });


        return file$info;
    },


};
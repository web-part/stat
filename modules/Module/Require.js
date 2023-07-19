

const Public = require('./Require/Public');
const Private = require('./Require/Private');



module.exports = {

    /**
    * 从指定的 js 内容中解析出模块的依赖信息。
    * @param {string} content 要解析的 js 内容。
    * @returns {Array} 返回模块的依赖列表。
    */
    parse(factory, beginNo) {
        let { type, content, } = factory;
        let publics = [];
        let privates = [];

        if (type == 'function') {
            publics = Public.parse({ content, beginNo, });
            privates = Private.parse({ content, beginNo, });
        }

        return { publics, privates, };
    },
};
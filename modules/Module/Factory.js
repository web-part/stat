
const Lines = require('@definejs/lines');
const $String = require('@definejs/string');

module.exports = {

    //获取 factory 在 content 中的起止行号。
    getLineNos(content, factory) { 

        if (factory.type != 'function') {
            return content;
        }



        let factoryContent = factory.content;
        let factoryLines = Lines.split(factoryContent);
        let byteLength = $String.getByteLength(factoryContent);
        let length = factoryContent.length;
        
        let placeholder = $String.random(32);

        content = content.replace(factoryContent, placeholder);

        let lines = Lines.split(content);
        let beginNo = Lines.getIndex(lines, placeholder);
        let endNo = beginNo + factoryLines.length - 1;

        return { beginNo, endNo, length, byteLength,};
    },
};
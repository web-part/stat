

const cheerio = require('cheerio');
const Path = require('@definejs/path');
const $String = require('@definejs/string');
const Lines = require('@definejs/lines');

/**
* 判断所在的行是否给注释掉了。
*/
function checkCommented(line, item) {
    return $String.between(line, '<!--', '-->').includes(item);

}

module.exports = {
    

    parse(content, { dir, file, regexp, }) {
        //提取出如引用了 html 分文件的 link 标签
        let list = content.match(regexp);

        if (!list) {
            return [];
        }



        let cwd = Path.dirname(file);
        let lines = Lines.split(content);
        let startNo = 0;    //下次搜索的起始行号

        if (cwd == './') {
            cwd = '';
        }

        list = list.map((item, index) => {
            let no = Lines.getIndex(lines, item, startNo);  //行号。
            let line = lines[no];                           //整一行的 html。

            startNo = no + 1;

            if (checkCommented(line, item)) { //已给注释掉了。
                return null;
            }


            let $ = cheerio;
            let props = $(item).attr();
            let href = props.href;
            let file = Path.join(cwd, href);
            let tabs = line.indexOf(item);              //前导空格数。

            return {
                no,         //所在的行号，从 0 开始。
                href,       //原始地址。
                cwd,    //
                file,       //完整的物理路径。 
                item,       //标签的 html 内容。
                line,       //整一行的 html 内容。
                tabs,       //前导空格数。
                props,      //完整的 html 属性集合。
            };

        }).filter((item) => { //要过滤一下。
            return !!item;
        });

        return list;
    },
};
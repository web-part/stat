

const cheerio = require('cheerio');
const MD5 = require('@definejs/md5');
const Lines = require('@definejs/lines');

module.exports = {

    parse(content, selectors) { 
        let $ = cheerio.load(content);
        let list = $(selectors.join(','));

        list = Array.from(list).map((item) => {
            let { attribs, } = item;
            let content = $.html(item);
            let lines = Lines.split(content);
            let md5 = MD5.get(content);

            let id = '';
            let method = '';




            ['view', 'panel', ].some((key) => { 
                let value = attribs[`data-${key}`];

                if (!value) {
                    return;
                }

                id = value;
                method = key;

                return true;
            });



            return {
                'id': id,
                'method': method,
                'factory': {
                    'type': item.name, //标签名，如 `div`。
                    'content': content,
                    'md5': md5,
                    'lines': lines.length,
                    'attribs': { ...item.attribs, },
                },
                
            };
        });

        return list;

      
    },
};

//一个文件里可能定义了多个模块。
let list = [];

let set = function (method, id, factory) {
    //针对 launch(factory);
    if (typeof id == 'function') {
        factory = id;
        id = '';
    }
    
    let type = typeof factory;
    let content = type == 'function' ? factory.toString() : '';

    list.push({
        'method': method,   //定义的方法名，如 `define`、`KISP.view`、`KISP.panel` 等。
        'id': id,           //模块的 id。

        'factory': {        //工厂函数。
            'type': type,
            'content': content,
        },
    });
};


//下面的 context 由 Context.js 模块生成。
{context}

try {
    //下面的 content 由实际的模块文件内容填充。
    {content}
}
catch (ex) {
    
}

return list;


const Tree = require('@definejs/tree');
const $String = require('@definejs/string');

let name$sample = {
    fn: `
        {let} {name} = function (id, factory) {
            set('{name}', id, factory);
        };
    `,

    obj: `
        {let} {name} = {};
    `,

};

module.exports = {


    get(defines) {
        let tree = new Tree();
        let list = [];

        defines.forEach((keys) => {
            keys = keys.split('.'); //如 `KISP.view`
            tree.set(keys, true);   // value 为 true。
        });

        tree.each(function (node) {
            let { keys, } = node;
            let isTop = keys.length == 1; //是否为顶级变量。


            let name = node.value ?
                'fn' :  //有值，说明出现在 defines 列表中，需要生成 define 函数。
                'obj';  //无值，说明不出现在 defines 列表中。 但它是一个间接节点，需要创建一个对象作为变量的容器。
            
            let sample = name$sample[name];

            let code = $String.format(sample, {
                'let': isTop ? 'let' : '',      //顶级变量的，需要加变量声明。
                'name': keys.join('.'),
            });

            list.push(code);

        });

        return list.join('');
    },
};

const $Object = require('@definejs/object');
const Key$Value = require('./Analyser/Key$Value');


module.exports = {
   
    /**
    * 对分析统计出来的列表信息从多个维度作进一步分析、提取和归类等，以便后续快速使用相关维度的数据。
    * @param {Array} infos 由 stat() 方法统计得到的信息列表（数组）。
    */
    stat(infos) {
        let ids = [];           //所有的模块 id 列表。 可能存在重复项（表示存在重复定义的模块）。
        let file$info = {};     //记录文件名对应的完整信息记录。
        let file$lines = {};    //记录文件名对应的文件内容的行数。
        let file$links = null;  //记录文件名对应的 html link 列表，仅用于 html 文件的情况。 此处先设置为 null，要用到再设置成 {}。
        let file$hrefs = null;  //记录文件名对应的 html link 的 href 列表，仅用于 html 文件的情况。 此处先设置为 null，要用到再设置成 {}。

        let md5$file = {};      //记录文件内容的 md5 值对应的文件名。 可能存在一对多，即存在内容完全一样的重复文件。
        let file$module = {};   //记录文件名对应的模块信息。 可能存在一对多，即一个文件里定义了两个模块（相同或不同模块）。
        let file$id = {};       //记录文件名对应的模块 id。 可能存在一对多，即一个文件里定义了两个模块（相同或不同模块）。
        let id$info = {};       //记录模块 id 对应的完整信息记录。 可能存在一对多，即在不同文件里重复定义了相同 id 的模块。
        let id$file = {};       //记录模块 id 对应的文件名，即模块所在的文件。 可能存在一对多，即在不同文件里重复定义了相同 id 的模块。
        let id$module = {};     //记录模块 id 对应的模块信息记录。 可能存在一对多，即重复定义了相同 id 的模块（在相同或不同文件）。应该以此为准判断是否存在重复 id 的模块。

        let id$parent = {};     //记录模块 id 对应的父模块 id。 值部分可能为空串。
        let id$parents = {};    //记录模块 id 对应的所有父模块 id。 值部分可能为空串。
        let id$childs = {};     //记录模块 id 对应的直接子模块 id 列表。
        let id$children = {};   //记录模块 id 对应的所有子模块 id 列表。
        let id$siblings = {};   //记录模块 id 对应的所有兄弟模块 id 列表（不包括自己）。
        let id$publics = {};    //记录模块 id 所依赖的公共模块列表。
        let id$privates = {};   //记录模块 id 所依赖的私有模块列表。
        let id$dependents = {}; //记录模块 id 的依赖者列表，即模块 id 被谁依赖了。


        infos.forEach((info, index) => {
            let { file, md5, lines, modules, links, } = info;

            modules.map((module) => {
                let { id, requires, } = module;
                let names = id.split('/');
                let name = names.slice(-1)[0];
                let parents = []; //向上追溯的所有的父节点 id。
                let parent = null;

                //扩展一些字段，方便后续使用。
                Object.assign(module, {
                    'name': name,
                    'names': names,
                });

                if (names.length > 1) {
                    let pid = parent = names.slice(0, -1).join('/'); //父模块 id。
                    let childs = id$childs[pid] || [];

                    childs.push(id);
                    id$childs[pid] = childs;

                    parents = names.map((name, index) => {
                        return names.slice(0, index + 1).join('/');
                    });
                    parents = parents.reverse();
                    parents = parents.slice(1);
                }

                ids.push(id);
                id$parent[id] = parent;
                id$parents[id] = parents;


                if (requires) {
                    let publics = requires.publics.map((item) => {//
                        //如 Key$Value.add(id$dependents, 'A', 'B'); 则表示 A 被 B 依赖了，即 B 依赖了 A。
                        Key$Value.add(id$dependents, item.id, id);
                        return item.id;
                    });

                    let privates = requires.privates.map((item) => {
                        let cid = `${id}/${item.id}`;
                        Key$Value.add(id$dependents, cid, id);
                        return item.id;
                    });

                    id$publics[id] = publics;
                    id$privates[id] = privates;
                }
                

                //以下可能存在一对多关系。
                Key$Value.add(id$file, id, file);
                Key$Value.add(id$info, id, info);
                Key$Value.add(id$module, id, module);
            });

            Key$Value.add(md5$file, md5, file);

            file$lines[file] = lines;
            file$info[file] = info;

            if (links) {
                file$links = file$links || {};
                file$hrefs = file$hrefs || {};

                file$links[file] = links;
                file$hrefs[file] = links.map(link => link.href);
            }


            //正常情况下，一个文件里只有一个模块定义，值为一个 {}。
            //如果有多个模块，则值存为一个 []。
            //如果该文件没有定义模块，则为 undefined，存为 json 文件时不存在该记录。
            (function (mod, length) { 
                if (length == 0) {
                    file$module[file] = undefined;
                    file$id[file] = undefined;
                    return;
                }

                if (length == 1) {
                    file$module[file] = mod;
                    file$id[file] = mod.id;
                    return;
                }

                //多于一个。
                file$module[file] = modules;
                file$id[file] = modules.map(module => module.id);
                
            })(modules[0], modules.length);
        });


        ids = ids.sort();

       
        ids.forEach((id) => {
             //收集指定模块下的所有子模块（包括间接子模块）。
            let children = ids.filter((mid) => {
                return mid.startsWith(`${id}/`);
            });

            id$children[id] = children;


            let parent = id$parent[id];

            if (typeof parent == 'string') {
                let childs = id$childs[parent] || [];

                //从兄弟结点中过滤掉自己。
                let siblings = childs.filter((mid) => {
                    return mid != id; 
                });

                id$siblings[id] = [...new Set(siblings)];
            }
        });



        let stat = {
            infos,
            ids,
            md5$file,
            file$lines,
            file$info,
            // file$links,
            // file$hrefs,
            file$module,
            file$id,
            id$file,
            id$info,
            id$module,
            id$parent,
            id$parents,
            id$childs,
            id$children,
            id$siblings,
            id$publics,
            id$privates,
            id$dependents,
        };

        if (file$links) {
            stat.file$links = file$links;
        }

        if (file$hrefs) {
            stat.file$hrefs = file$hrefs;
        }
        
        //排序，为了更好看。
        $Object.each(stat, (key, value) => {
            if ($Object.isPlain(value)) {
                stat[key] = $Object.sort(value);
            }
        });

        return stat;
    },

    match(moduleStat, htmlStat) {
        let matchedIds = [];
        let jsIds = [];
        let htmlIds = [];

        Object.keys(moduleStat.id$file).forEach((id) => {
            let htmlFile = htmlStat.id$file[id];

            if (htmlFile) {
                matchedIds.push(id);
            }
            else {
                jsIds.push(id);
            }
        });

        Object.keys(htmlStat.id$file).forEach((id) => {
            let jsFile = moduleStat.id$file[id];

            if (jsFile) {
                // matchedIds.push(id);
            }
            else {
                htmlIds.push(id);
            }
        });

        return {
            matchedIds,
            jsIds,
            htmlIds,
        }

        
    },
};
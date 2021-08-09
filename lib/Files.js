

const fs = require('fs');
const path = require('path');
const Patterns = require('@definejs/patterns');
const File = require('@definejs/file');
const MD5 = require('@definejs/md5');
const Lines = require('@definejs/lines');

const Encoding = require('./Files/Encoding');



module.exports = {

    stat(baseDir, patterns, excludes, fn) {
        //重载 stat(baseDir, patterns, fnMap);
        if (typeof excludes == 'function') {
            fn = excludes;
            excludes = [];
        }


        let files = Patterns.getFiles(baseDir, patterns, excludes);

        let infos = [];

        files.forEach((file, index) => {
            let content = File.read(file);
            let md5 = MD5.get(content);
            let stat = fs.statSync(file);
            let isUTF8 = Encoding.isUTF8(content);
            let ext = path.extname(file).toLowerCase();    //统一转成小写。
            let dir = path.dirname(file) + '/';
            let name = path.basename(file);
            let lines = Lines.split(content);


            let info = {
                'file': file,
                'dir': dir,
                'name': name,
                'ext': ext,
                'isUTF8': isUTF8,
                'size': stat.size,
                'md5': md5,
                'lines': lines.length,
                'content': content,
                'stat': stat,
            };

            if (fn) {
                info = fn(info, index);
            }

            if (info) {
                infos.push(info);
            }

        });

        return infos;
    },
};
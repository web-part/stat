

const fs = require('fs');
const Path = require('@definejs/path');
const Patterns = require('@definejs/patterns');
const $String = require('@definejs/string');
const $Object = require('@definejs/object');
const File = require('@definejs/file');
const MD5 = require('@definejs/md5');
const Lines = require('@definejs/lines');




module.exports = exports = {

    readDir(dir, patterns) {
        let files = Patterns.getFiles(dir, patterns);
        let file$info = {};

        files.map((file) => {
            let info = exports.readFile(file);

            file = Path.relative(dir, file);
            file$info[file] = info;
        });

        return file$info;
    },

    readFile(file) {
        let content = File.read(file);
        let md5 = MD5.get(content);
        let lines = Lines.split(content);
        let stat = fs.statSync(file);
        let byteLength = $String.getByteLength(content);
        let length = content.length;

        stat = $Object.filter(stat, ['atimeMs', 'birthtimeMs', 'ctimeMs', 'mtimeMs', 'size',]);
        lines = lines.length;

        return { content, md5, lines, stat, byteLength, length, };
    }

  
};
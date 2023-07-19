


const { Module, } = require('./index');

const File = require('@definejs/file');


let dir = '/Users/micty/Studio/@webpart/server/web/htdocs';

let file$info = Module.parse(dir, {

    defines: [
        'define',
        'define.panel',
        'define.view',
        'definejs.launch', //注意这个是针对 launch() 的。

    ],

    patterns: [
        'data/**/*.js',
        'lib/**/*.js',
        'modules/**/*.js',
        'views/**/*.js',
        'index.js',     //注意这个是针对 launch() 的。
    ],
});

File.writeJSON('./file$info.json', file$info);
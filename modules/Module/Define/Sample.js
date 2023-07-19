
const path = require('path');
const $String = require('@definejs/string');
const File = require('@definejs/file');
const Context = require('./Sample/Context');


let sample = '';

function readSample () { 
    let file = path.resolve(__dirname, './Sample/sample.js');
    sample = File.read(file);
    return sample;
};



module.exports = {

    get(defines) {

        sample = sample || readSample();

        let context = Context.get(defines);
        let code = $String.format(sample, { context, });

        return code;
        
    },
};
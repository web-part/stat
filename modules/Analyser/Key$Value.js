

module.exports = {
    
    add(key$value, key, value) {
        let has = key in key$value;

        if (!has) {
            key$value[key] = value;
            return;
        }

        let old = key$value[key];
        if (old === value) {
            return;
        }

        if (Array.isArray(old)) {
            key$value[key] = [...new Set([...old, value,])];
            return;
        }

        //
        key$value[key] = [old, value,];

    },
};


module.exports = {
    add(key$list, key, item) {
        let list = key$list[key];

        if (!list) {
            list = key$list[key] = [];
        }

        if (!list.includes(item)) {
            list.push(item);
        }
    }
};
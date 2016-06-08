'use strict';

let hash_check = require('../hash_check');

module.exports = (task) => {
    return new Promise((resolve, reject) => {
        hash_check(task, (find, task) => {
            if (find) resolve(task);
            else reject (task);
        });
    });
};
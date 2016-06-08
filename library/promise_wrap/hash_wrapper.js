'use strict';

let hash = require('../hash');

module.exports = (task) => {
    return new Promise((resolve) => {
        hash(task, () => {
            resolve(task);
        });
    });
};
'use strict';

let rplot = require('../rplot');

module.exports = (task) => {
    return new Promise((resolve, reject) => {
        rplot(task, (code) => {
            if (code == 0) resolve(task);
            else reject(code);
        });
    });
};
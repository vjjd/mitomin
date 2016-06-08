'use strict';

let archiver = require('../archiver');

module.exports = (task) => {
    return new Promise((resolve) => {
        archiver(task, (task) => {
            resolve(task);
        })
    });
};
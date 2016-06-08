'use strict';

let heteroplasmy = require('../heteroplasmy');

module.exports = (task) => {
    return new Promise((resolve) => {
        heteroplasmy(task, () => {
            resolve(task);
        });
    });
};
'use strict';

let bwa = require('../bwa');

module.exports = (task) => {
    return new Promise((resolve, reject) => {
        bwa(task, (code) => {
            if(code == 0) resolve(task);
            else reject(code);
        });
    });
};
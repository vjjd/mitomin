'use strict';

let config = require('../config');
let spawn  = require('child_process').spawn;

module.exports = (task, callback) => {
    spawn('Rscript', [
        `${config.heteroplasmyR}`,
        `${config.resultsFolder}/${task.hash}/${task.bodyName}`,
        `${task.label}`])
        .on('close', code => callback(code));
};
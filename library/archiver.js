"use strict";

let fs       = require('fs');
let archiver = require('archiver');
let config   = require('../config');

module.exports = (task, callback) => {
    let output = fs.createWriteStream(`${config.archivesFolder}/data.zip`);
    let archive = archiver('zip');

    archive.on('error', (err) => {
        throw err;
    });
    archive.pipe(output);
    task.targets.forEach(result => {
        archive.directory(`${config.resultsFolder}/${result}`, 'data');
    });
    archive.finalize();
    
    output.on('close', () => callback(task));
};
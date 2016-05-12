'use strict';

let fs = require('fs');
let spawn = require('child_process').spawn;
let config = require('../config');
let sam = require('./sam');

module.exports = (key, callback) => {
    const path = `${config.uploads}/${key}`;
    const template = '#!/usr/bin/env bash\n' +
        `mv ${path} ${path}.fastq\n` +
        `${config.bwa} aln ${config.RSRS} ${path}.fastq > ${path}.sai\n` +
        `${config.bwa} samse ${config.RSRS} ${path}.sai ${path} > ${path}\n`;

    fs.writeFile(`${path}.sh`, template, 'utf-8', () => {
        spawn('sh', [`${path}.sh`])
            .on('close', code => {
                sam(`${key}`, callback);
            });
    });
};
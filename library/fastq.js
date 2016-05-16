'use strict';

let fs = require('fs');
let spawn = require('child_process').spawn;
let config = require('../config');

module.exports = (task) => {
    return new Promise((resolve) => {
        const path = `${config.uploads}/${task.key}`;
        const template = '#!/usr/bin/env bash\n' +
            `mv ${path} ${path}.fastq\n` +
            `${config.bwa} aln ${config.RSRS} ${path}.fastq > ${path}.sai\n` +
            `${config.bwa} samse ${config.RSRS} ${path}.sai ${path} > ${path}\n`;

        fs.writeFile(`${path}.sh`, template, 'utf-8', () => {
            spawn('sh', [`${path}.sh`])
                .on('close', code => {
                    resolve(task);
                });
        });
    });
};
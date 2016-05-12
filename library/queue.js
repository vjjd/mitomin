'use strict';

let async = require('async');
let redis = require('./redis');
let   sam = require('./sam');
let fastq = require('./fastq');

let queue = async.queue((file, callback) => {
    let extension = file.name.toLowerCase().match(/\.(sam|fastq|fq|fasta|fa)$/);
    if (extension) extension = extension[1];

    switch (extension) {
        case 'sam':
            sam(file.key, callback);
            break;

        case 'fastq':
            fastq(file.key, callback);
            break;

        default:
            redis.get(file.key, (err, file) => {
                file = JSON.parse(file);
                file.status = 'unsupported file';

                redis.set(file.key, JSON.stringify(file), err => callback());
            });
            break;
    }
});

module.exports = queue;
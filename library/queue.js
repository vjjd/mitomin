'use strict';

let heteroplasmy = require('./heteroplasmy');
let redisStatus  = require('./redis-status-file');
let async        = require('async');
let redis        = require('./redis');
let   sam        = require('./sam');
let fastq        = require('./fastq');
let rplot        = require('./rplot');

let queue = async.queue((task, callback) => {
    let extension = task.name.toLowerCase().match(/\.(sam|fastq|fq|fasta|fa)$/);
    if (extension) extension = extension[1];

    switch (extension) {
        case 'sam':
            heteroplasmy(task)
                .then(rplot)
                .then(redisStatus)
                .then(callback);
            break;

        case 'fastq':
            fastq(task)
                .then(heteroplasmy)
                .then(rplot)
                .then(redisStatus)
                .then(callback);
            break;

        default:
            redis.get(task.key, (err, task) => {
                task = JSON.parse(task);
                task.status = 'unsupported task';

                redis.set(task.key, JSON.stringify(task), err => callback());
            });
            break;
    }
});

module.exports = queue;
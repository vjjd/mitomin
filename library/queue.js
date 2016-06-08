'use strict';

let async   = require('async');
let redis   = require('./redis');
let promise = require('./promise_wrap');
let consts  = require('./constants');

let queue = async.queue((task, cb) => {
    switch (task.type) {
        case consts.tTypes.upload.file.unhashed:
            promise.hash(task)
                .then(promise.hash_check)
                .then(task => {
                    task.type = task.label.toLowerCase().match(/\.?\w+$/)[0];
                    return task;
                }, task => {
                    task.type = consts.tTypes.global.reload;
                    task.status = consts.tStatus.done;
                    return task;
                })
                .then(cb)
                .catch(console.log);
            break;
        
        case consts.tTypes.archive.unhashed:
            promise.hash(task)
                .then(promise.hash_check)
                .then(task => {
                    task.type = consts.tTypes.archive.hashed;
                    return task;
                }, task => {
                    task.status = consts.tStatus.aborted;
                    return task;
                })
                .then(cb)
                .catch(console.log);
            break;

        case consts.tTypes.archive.hashed:
            promise.archiver(task)
                .then(task => {
                    task.status = consts.tStatus.done;
                    return task;
                })
                .then(cb)
                .catch(console.log);
            break;
        
        case consts.tTypes.upload.file.sam:
            promise.heteroplasmy(task)
                .then(promise.rplot)
                .then(task => {
                    task.status = consts.tStatus.done;
                    return task;
                })
                .then(cb)
                .catch(console.log);
            break;

        case consts.tTypes.upload.file.fq:
        case consts.tTypes.upload.file.fastq:
            promise.bwa(task)
                .then(promise.heteroplasmy)
                .then(promise.rplot)
                .then(task => {
                    task.status = consts.tStatus.done;
                    return task;
                })
                .then(cb)
                .catch(console.log);
            break;

        default:
            task.status = consts.tStatus.unsup;
            cb(task);
            break;
    }
});

module.exports = queue;
'use strict';

let redis  = require('./redis');
let fs     = require('fs');
let consts = require('./constants');
let config = require('../config');

module.exports = (task, cb) => {
    switch (task.type) {
        case consts.tTypes.upload.file.unhashed:
            redis.hmget(['hash', task.hash], (err, val) => {
                if (err) throw err;
                if (!val[0]) {
                    redis.hmset(['hash', task.hash, consts.tStatus.pending], (err) => {
                        if (err) throw err;
                        fs.mkdir(`${config.resultsFolder}/${task.hash}`, () => {
                            cb(true, task)
                        });
                    });
                } else cb(false, task);
            });
            break;
        
        case consts.tTypes.archive.unhashed:
            let isNotEmpty = (status) => {
                if (status) return status;
            };

            redis.hmget([].concat('hash', task.targets), (err, val) => {
                if (err) throw err;
                cb(val.every(isNotEmpty), task);
            });
            break;
    }
};
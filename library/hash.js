'use strict';

const crypto = require('crypto');
let fs       = require('fs');
let redis    = require('./redis');
let config   = require('../config');
let consts   = require('./constants');

module.exports = (task, callback) => {
    const hash = crypto.createHash('sha1');
    let saltyHash = (secret, salt) => {
        crypto.pbkdf2(secret, salt, 100000, 16, 'sha1', (err, key) => {
            if (err) throw err;
            task.hash = hash.digest('hex') + key.toString('hex');
            callback();
        });
    };

    switch (task.type) {
        case consts.tTypes.upload.file.unhashed:
            let stream = new fs.createReadStream(`${config.uploads}/${task.id}`, 'utf8');
            
            stream.on('data', (chunk) => hash.update(chunk));
            stream.on('end', () => saltyHash('secret', 'salt'));
            break;

        case consts.tTypes.archive.unhashed:
            hash.update(task.targets.join(''));
            saltyHash('kappa', 'elegiggle');
            break;
    }
};
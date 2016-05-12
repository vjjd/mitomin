'use strict';

let heteroplasmy = require('./heteroplasmy');
let redis = require('./redis');
let config = require('../config');

module.exports = (key, callback) => {
    const path = `${config.uploads}/${key}`;

    heteroplasmy(path, () => {
        redis.get(key, (err, file) => {
            file = JSON.parse(file);
            file.status = 'done';

            redis.set(key, JSON.stringify(file), err => {
                callback();
            });
        });
    });
};
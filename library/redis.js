'use strict';

let redis  = require('redis');
let config = require('./../config');

let client = redis.createClient(config.redis.port, config.redis.host);

if (config.redis.auth) {
    client.auth(config.redis.auth);
}

client.on('error', err => {
    throw err 
});

module.exports = client;
'use strict';

let      winston = require('winston');
let       morgan = require('morgan');

winston.emitErrs = true;

let logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        })
        ,
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

let stream = {
    write: function(message, encoding){
        logger.info(message.replace(/(\u001b|\[0m|\[32m|\[36m|\n)/g, ''));
    }
};

module.exports = logger;
module.exports.middleware = morgan('dev', {"stream": stream });
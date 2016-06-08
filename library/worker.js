'use strict';

let   redis = require('./redis');
let   queue = require('./queue');
let  logger = require('./logger');
let  consts = require('./constants');

let worker = {
    getTask: (task_hash) => {
        return new Promise((fulfill, reject) => {
            redis.get(task_hash, (err, data) => {
                if (err) reject(err);
                else fulfill(JSON.parse(data))
            })
        });
    },

    updateTask: (task) => {
        return new Promise((fulfill, reject) => {
            redis.set(task.id, JSON.stringify(task), err => {
                if (err) reject(err); 
                else fulfill(task)
            });
        });
    },

    endTask: (task) => {
        logger.info(`INFO ${task.hash} status: ${task.status}`);
        worker.updateTask(task);
    },
    
    addTask: (task) => {
        worker.updateTask(task)
            .then(task => {
                queue.push(task, (task) => {
                    worker.updateTask(task)
                        .then(task => {
                            if (task.status == 'pending') {
                                queue.unshift(task, (task) => {
                                    worker.endTask(task);
                                });
                            } else worker.endTask(task);
                        });
                });
            });
    }
};

module.exports = worker;
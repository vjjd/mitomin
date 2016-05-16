let redis = require('./redis');

module.exports = (task) => {
    return new Promise((resolve) => {
        redis.get(task.key, (err, file) => {
            file = JSON.parse(file);
            file.status = 'done';

            redis.set(task.key, JSON.stringify(file), err => {
                resolve(task);
            });
        });
    });
};

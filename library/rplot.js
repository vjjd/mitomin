let config = require('../config');
let spawn = require('child_process').spawn;

module.exports = (task) => {
    return new Promise((resolve) => {
        spawn('Rscript', [
            `${__dirname}/heteroplasmy.R`,
            `${config.uploads}/${task.key}`,
            `${task.name}`]);
        resolve(task);
    });
};
'use strict';

let  multer = require('multer');
let  worker = require('./worker');
let express = require('express');
let consts  = require('./constants');

let router = express.Router();
let upload = multer({ dest: 'uploads' });

router.post('/tasks', upload.any(), (req, res) => {
    let tasks = req.files.map(file => {
        return {
            label: file.originalname,
            id: file.filename,
            bodyName: file.originalname.replace(/\.?\w+$/g, ''),
            hash: '',
            type: consts.tTypes.upload.file.unhashed,
            status: consts.tStatus.pending
        }
    });
    
    tasks.forEach(worker.addTask);

    res.json({
        upload: true,
        tasks
    });
});

router.get('/tasks/:id', (req, res) => {
    worker.getTask(req.params.id).then(task => res.json(task));
});

router.get('/archive', (req, res) => {
    let task = {
        targets: req.query.results.split(','),
        hash: '',
        type: consts.tTypes.archive.unhashed,
        status: consts.tStatus.pending
    };
    
    worker.addTask(task);

    res.json({success: true});
});

module.exports = router;
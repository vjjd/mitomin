'use strict';

let  multer = require('multer');
let express = require('express');
let   queue = require('./queue');
let   redis = require('./redis');

let router = express.Router();
let upload = multer({ dest: 'uploads' });

// POST /files
router.post('/files', upload.any(), (req, res) => {
    let files = req.files.map(file => {
        return {
            name: file.originalname,
            key: file.filename,
            status: 'pending'
        }
    });

    files.forEach(file => {
        redis.set(file.key, JSON.stringify(file), err => {
            queue.push(file, () => {
                console.log(`Task ${file.key} is ready`);
            });
        })
    });

    res.json({ upload: true, files });
});

// GET /files
router.get('/files/:id', (req, res) => {
    redis.get(req.params.id, (err, data) => {
        res.json(JSON.parse(data));
    });
});

module.exports = router;
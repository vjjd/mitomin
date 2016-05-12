#! /usr/bin/env node
'use strict';

let express = require('express');
let  morgan = require('morgan');
let  config = require('./config');
let     api = require('./library/api');

let app = express();
app.locals.basedir = './public';
app
    .set('view engine', 'pug')
    .use(morgan('dev'))
    .use(express.static('public'))
    .use('/api/v1', api)
    .get('/', (req, res) => res.render('index'))
    .listen(config.port);
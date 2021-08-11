'use strict';

/**
 * Get the npm modules
 */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

/**
 * Enviroment variables config
 */
dotenv.config({ path: "./env/.env" });

/**
 * Get the router modules
 */
let indexRouter = require('./routes/index');
let messageRouter = require('./routes/message');
let adminRouter = require('./routes/admin');

/**
 * Create the express app
 */
let app = express();

/**
 * Set the middlewares
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Set the template engine and its default directory
 */
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'pug');

/**
 * Set the CORS
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Allow', 'GET, POST');
    next();
});

/**
 * API ROUTES
 */
app.use('/', indexRouter);              // Route to render the index page
app.use('/admin', adminRouter);         // Route to render the admin login page
app.use('/message', messageRouter);     // Route to access the messages API

/**
 * Export the express app
 */
module.exports = app;

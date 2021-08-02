'use strict';

/**
 * Get the npm modules
 */
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');

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

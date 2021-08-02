'use strict';

/**
 * Imports
 */
let express = require('express');
let controller = require('../controllers/message');

let router = express.Router();  // Create a router

/**
 * Routes config
 */
router.post('/send', controller.sendMessage);

module.exports = router;    // Exporting the router obj


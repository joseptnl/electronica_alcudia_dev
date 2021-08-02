'use strict'

/**
 * Imports
 */
let express = require('express');
let path = require('path');
 
let router = express.Router();  // Create a router

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', '/public/adminLoging.html'));
});

module.exports = router;
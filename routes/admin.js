'use strict'

/**
 * Imports
 */
const express = require('express');
const path = require('path');
const controller = require('../controllers/admin');
const middlewares = require("../middlewares/admin");
 
const router = express.Router();  // Create a router

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', '/public/adminLogin.html'));
});

/**
 * Petitions management
 */
router.post('/login', controller.login);
/**
 * Sets the middleware that checks the client session 
 * once is logged in
 */
router.use(middlewares.authorization);
router.get("/logout", controller.logout);
router.get("/admin-page", controller.adminPage);


/**
 * Exports
 */
module.exports = router;
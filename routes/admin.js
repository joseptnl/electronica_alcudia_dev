'use strict'

/**
 * Imports
 */
const express = require('express');
const path = require('path');
const controller = require('../controllers/admin');
const middlewares = require("../middlewares/admin");
const multipart = require("connect-multiparty");
 
const router = express.Router();  // Create a router

const imagesMultipart = multipart({
  uploadDir: "./public/uploads/images"
});
const cataloguesMultipart = multipart({
  uploadDir: "./public/uploads/catalogues"
});

/**
 * Petitions management
 */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/public/adminLogin.html'));
});
router.post('/login', controller.login);
router.get("/get-images/:category", controller.getImages);
router.get("/get-catalogues", controller.getCatalogues);
router.get("/refresh-catalogues", controller.refreshCatalogues);
/**
 * Sets the middleware that checks the client session 
 * once is logged in
 */
router.use(middlewares.authorization);
router.get("/logout", controller.logout);
router.get("/admin-page", controller.adminPage);
router.post("/save-image", imagesMultipart, controller.saveImage);
router.get("/delete-image/:url", controller.deleteImage);
router.post("/save-catalogue", cataloguesMultipart, controller.saveCatalogue);
router.get("/delete-catalogue/:url", controller.deleteCatalogue);

/**
 * Exports
 */
module.exports = router;
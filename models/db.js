'use strict';

/**
 * Imports
 */
var sqlConnection = require('../data/config');

const getAdminSQL = "SELECT * FROM admin WHERE ?";
const getAboutImagesSQL = "SELECT url, alt, name FROM image WHERE category";
const getCatalogueImagesSQL = "SELECT url, alt, name FROM image WHERE NOT category";
const setImageSQL = "INSERT INTO image VALUES (?,?,?,?)";
const deleteImageSQL = "DELETE FROM image WHERE ?";
const getCataloguesSQL = "SELECT * FROM catalogue";
const addCatalogueSQL = "INSERT INTO catalogue VALUES (?,?,?,?)";
const deleteCatalogueSQL = "DELETE FROM catalogue WHERE ?";
const deleteCatalogueByExpiryDateSQL = "DELETE FROM catalogue WHERE expiryDate <= ?";
const getCataloguesByExpiryDateSQL = "SELECT * FROM catalogue WHERE expiryDate <= ?";

/**
 * Creating the model API to comunicate with the DB
 */
var adminModel = {
    // Search an admin by id
    getAdmin: (data, callback) => {
        if (sqlConnection) {
            sqlConnection.query(
                getAdminSQL,
                data,
                (err, result) => {
                    callback(err, result);
                }
            );
        }
    },
    /**
     * Search the array of images that belongs to the about section
     * or to the category section. Depending on wich value the category
     * parameter has.
     * @param {*} category 
     * @param {*} callback 
     */
    getImages: (category, callback) => {
        let getImagesSQL = null;
        getImagesSQL = getCatalogueImagesSQL;
        // If it is true the section will be about and if not it will be catalogue
        if (category) getImagesSQL = getAboutImagesSQL;
        // Starting query
        if (sqlConnection) {
            sqlConnection.query(
                getImagesSQL,
                (err, result) => {
                    callback(err, result);
                }
            );
        }
    },
    /**
     * Save an image with its three atributes in the db
     * @param {*} data 
     * @param {*} callback 
     */
    addImage: (data, callback) => {
        if (sqlConnection) {
            sqlConnection.query(
                setImageSQL,
                data,
                (err, result) => {
                    callback(err, result);
                }
            );
        }
    },
    deleteImage: (data, callback) => {
        if (sqlConnection) {
            sqlConnection.query(
                deleteImageSQL,
                data,
                (err, result) => {
                    callback(err, result);
                }
            );
        }
    },
    getCatalogues: (callback) => {
        if (sqlConnection) {
            sqlConnection.query(
                getCataloguesSQL,
                (err, result) => {
                    callback(err, result);
                }
            );
        }
    },
    addCatalogue: (data, callback) => {
        if (sqlConnection) {
            sqlConnection.query(
                addCatalogueSQL,
                data,
                (err, result) => {
                    callback(err, result);
                }
            )
        }
    },
    deleteCatalogue: (data, callback) => {
        if (sqlConnection) {
            sqlConnection.query(
                deleteCatalogueSQL,
                data,
                (err, result) => {
                    callback(err, result);
                }
            )
        }
    },
    deleteCatalogueByExpiryDate: (data, callback) => {
        if (sqlConnection) {
            sqlConnection.query(
                deleteCatalogueByExpiryDateSQL,
                data,
                (err, result) => {
                    callback(err, result);
                }
            )
        }
    },
    getCataloguesByExpiryDate: (data, callback) => {
        if (sqlConnection) {
            sqlConnection.query(
                getCataloguesByExpiryDateSQL,
                data,
                (err, result) => {
                    callback(err, result);
                }
            )
        }
    }
};

/**
 * Exports
 */
module.exports = adminModel;

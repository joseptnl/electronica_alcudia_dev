'use strict';

/**
 * Imports
 */
var sqlConnection = require('../data/config');

const getAdminSQL = "SELECT * FROM admin WHERE ?";

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
    }
};

/**
 * Exports
 */
module.exports = adminModel;

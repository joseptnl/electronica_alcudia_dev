'use strict'

/**
 * MODULE TO CONFIG THE CONNECTION WITH MYSQL DATABASE
 */

/**
 * Imports
 */
const mysql = require("mysql2");

/**
 * Program variables
 */
const host = process.env.DB_HOST, 
    user = process.env.DB_USER,
    password = process.env.DB_PASS,
    database = process.env.DB_NAME,
    port = process.env.DB_POST

/**
 * Set the connection configuration options
 */
const config = {
    host: host,
    user: user,
    password: password,
    port: port,
    database: database
};

/**
 * Starting the connection
 */
const connection = mysql.createConnection(config);

/**
 * Exports the connection
 */
module.exports = connection;
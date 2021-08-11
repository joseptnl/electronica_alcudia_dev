
'use strict'

/**
 * Imports
 */
const adminModel = require('../models/admin');
const bcryptjs = require('bcryptjs');
const jwt = require("jwt-simple");
const moment = require("moment");

/**
 * Creating the controller API
 */
const controller = {
    login: (req, res) => {
        // Call the model function to get the requested data
        const data = { id: req.body.id };
        adminModel.getAdmin(data, (err, results) => {
            if (err) return res.status(500).send({
                message: "An error has ocurred trying to get the registered admin user.",
                error: err
            });
            if (results.length == 1) {
                // It's all right for the checking, let's get started
                const code = req.body.code; // Obtain the code introduced by the client
                const hash = results[0].code;   // Obtain the hashed code from the db query
                const equalCodes = bcryptjs.compareSync(code, hash);    //Comparing the code with the hashed code
                // If they are equals
                if (equalCodes) {
                    // Send a success message and the token
                    return res
                        .cookie("auth", createToken(data), {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "Strict"
                        })
                        .status(200)
                        .send({
                            message: "The login has been successful."
                        });
                }
            }
            return res.status(400).send({
                message: "The id or the code are wrong."
            });
        });
    },
    logout: (req, res) => {
        return res
            .clearCookie("auth")
            .status(200)
            .send({
                message: "The logout has been successful.",
                id: req.id
            });
    },
    adminPage: (req, res) => {
        res.set("Cache-Control", "no-store");   // The browser won't store the page in the cache 
                                                // and clicking back the page won't be reloaded
        res.render("adminPanel", {
            id: req.id
        });
    }
};

/**
 * Auxiliar functions to support the main API ones
 */
const createToken = (data) => {
    let payload = {
        id: data.id,
        creationDate: moment().unix(),
        expiryDate: moment().add(process.env.JWT_VALID_TIME, "hour").unix()
    }
    return jwt.encode(payload, process.env.JWT_SECRET_KEY);
};

/**
 * Exports
 */
module.exports = controller;
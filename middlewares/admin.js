
'use strict'

/**
 * Imports
 */
const jwt = require("jwt-simple");
const moment = require("moment");

/**
 * Middleware functions
 */
const middlewares = {
    /**
    * Creates a middleware that will be executed to check the
    * client session validity
    * @returns check session middleware
    */
    authorization: (req, res, next) => {
        const userToken = req.cookies.auth; // Get the token stored in the cookie called auth
        if (!userToken) {
            return res.status(400).send({
                message: "There isn't a user token."
            });
        }
        // Decode the token verifying the signature
        let payload = null;
        try {
            payload = jwt.decode(userToken, process.env.JWT_SECRET_KEY);
        } catch (err) {
            return res.status(400).send({
                message: "The user token isn't valid.",
                error: err
            });
        }
        // Check if the token has already expired
        if (payload.expiryDate < moment().unix()) {
            return res.status(400).send({
                message: "The token has already expired."
            });
        }
        // Set the admin id to the body
        req.id = payload.id;

        next();
    }
};

/**
 * Exports
 */
module.exports = middlewares;
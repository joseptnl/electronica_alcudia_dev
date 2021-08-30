
'use strict'

/**
 * Imports
 */
const adminModel = require('../models/db');
const bcryptjs = require('bcryptjs');
const jwt = require("jwt-simple");
const moment = require("moment");
const fs = require("fs");

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
                        // Create a cookie called auth(authorization) wich will contain the jwt
                        .cookie("auth", createToken(data), {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax"
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
            // Delete the cookie that contains the jwt
            .clearCookie("auth")
            .status(200)
            .send({
                message: "The logout has been successful.",
                id: req.id
            });
    },
    adminPage: (req, res) => {
        res.set("Cache-Control", "no-store");   // The browser won't store the page in the cache 
        // and when clicking back btn the page won't be reloaded
        res.render("adminPanel", {
            id: req.id
        });
    },
    saveImage: (req, res) => {
        if (!req.files) {
            return res.status(400).send({
                message: "Image not send."
            });
        }
        const path = req.files.image.path;
        const url = path.split('/').slice(-1)[0];
        const extension = url.split('.').slice(-1)[0];
        if (extension === "jpg" || extension === "png") {
            let success = false;
            const data = [
                url,
                req.body.alt,
                getBooleanFromCategory(req.body.category),
                req.files.image.name
            ];
            adminModel.addImage(data, (err, result) => {
                if (err) {
                    fs.unlink(path, () => {
                        return res.status(500).send({
                            message: "There was a problem saving the image.",
                            err: err
                        });
                    });
                    return;
                }
                if (!result) {
                    fs.unlink(path, () => {
                        return res.status(404).send({
                            message: "The image couldn't be saved."
                        });
                    });
                    return;
                }
                return res.status(200).send({
                    message: "The image upload was successful.",
                    result: result
                });
            });
            return;
        }
        fs.unlink(path, () => {
            return res.status(400).send({
                message: "The file has an invalid extension."
            });
        });
    },
    getImages: (req, res) => {
        const category = getBooleanFromCategory(req.params.category);
        adminModel.getImages(category, (err, result) => {
            if (err) return res.status(500).send({
                message: "There was a problem getting the images.",
                err: err
            });
            if (!result) return res.status(404).send({
                message: "There wasn't images to get from the DB."
            });
            return res.status(200).send({
                message: "The fetch of the images was successful.",
                result: result
            });
        });
    },
    deleteImage: (req, res) => {
        const data = { url: req.params.url };
        adminModel.deleteImage(data, (err, result) => {
            if (err) return res.status(500).send({
                message: "There was a problem deleting the image.",
                err: err
            });
            if (!result) return res.status(404).send({
                message: "The image doesn't exists."
            });
            fs.unlink("public/uploads/images/" + data.url, err => {
                if (err) return res.status(500).send({
                    message: "The image couldn't be deleted from the directory.",
                    err: err
                });
                return res.status(200).send({
                    message: "The deleting has been successful.",
                    result: result
                });
            });
        });
    },
    saveCatalogue: (req, res) => {
        if (!req.files) {
            return res.status(400).send({
                message: "The image wasn't uploaded."
            });
        }
        let path = req.files.catalogue.path;
        let url = path.split('/').slice(-1)[0];
        const extension = url.split('.').slice(-1)[0];
        if (extension === "pdf") {
            adminModel.addCatalogue(
                [
                    url,
                    req.files.catalogue.name,
                    req.body.title,
                    req.body.expiryDate
                ],
                (err, result) => {
                    if (err) {
                        fs.unlink(path, () => {
                            return res.status(500).send({
                                message: "There was a problem saving the catalogue.",
                                err: err
                            });
                        });
                        return;
                    }
                    if (!result) {
                        fs.unlink(path, () => {
                            return res.status(404).send({
                                message: "The catalogue couldn't be saved."
                            });
                        });
                        return;
                    }
                    return res.status(200).send({
                        message: "The catalogue adding was successful.",
                        result: result
                    });
                }
            );
            return;
        }
        fs.unlink(path, () => {
            return res.status(200).send({
                message: "The file had an invalid extension.",
                result: result
            });
        });
    },
    getCatalogues: (req, res) => {
        adminModel.getCatalogues((err, result) => {
            if (err) return res.status(500).send({
                message: "There was an error getting the catalogues.",
                err: err
            });
            if (!result) return res.status(404).send({
                message: "The catalogues couldn't be got."
            });
            const actualDate = moment().format("YYYY-MM-DD");
            let catalogues = result.filter((catalogue) => {
                const expiryDate = moment(catalogue.expiryDate).format("YYYY-MM-DD")
                if (moment(actualDate).isBefore(expiryDate)) return catalogue;
            });
            return res.status(200).send({
                message: "The catalogues fetch was successful.",
                result: catalogues
            });
        });
    },
    deleteCatalogue: (req, res) => {
        adminModel.deleteCatalogue(
            { url: req.params.url },
            (err, result) => {
                if (err) return res.status(500).send({
                    message: "There was an error deleting the catalogue.",
                    err: err
                });
                if (!result) return res.status(404).send({
                    message: "The searched catalogue doesn't exist."
                });
                fs.unlink(
                    "public/uploads/catalogues/" + req.params.url,
                    (err) => {
                        if (err) res.status(500).send({
                            message: "The catalogue couldn't be deleted from the directory.",
                            err: err
                        });
                        return res.status(200).send({
                            message: "The catalogue deleting has been successful.",
                            result: result
                        });
                    }
                )
            }
        );
    },
    refreshCatalogues: (req, res) => {
        let error = undefined;
        const actualDate = moment().format("YYYY-MM-DD");
        adminModel.getCataloguesByExpiryDate(
            [
                actualDate
            ],
            (err, result) => {
                if (err) return res.status(500).send({
                    message: "There was an error getting the expired catalogues.",
                    err: err
                });
                if (!result) return res.status(404).send({
                    message: "The expired catalogues couldn't be got."
                });
                result.forEach(element => {
                    fs.unlink(
                        "public/uploads/catalogues/" + element.url,
                        (err) => {
                            error = err;
                        }
                    );
                });
                if (error !== undefined) return error;
                adminModel.deleteCatalogueByExpiryDate(
                    [
                        actualDate
                    ],
                    (err, result) => {
                        if (err) return res.status(500).send({
                            message: "There was an error deleting the expired catalogues.",
                            err: err
                        });
                        if (!result) return res.status(404).send({
                            message: "The expired catalogues couldn't be deleted."
                        });
                        return res.status(200).send({
                            message: "The expired catalogues deleting was successful",
                            result: result
                        });
                    }
                );
            }
        );
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
 * Converts to boolean the category passed.
 */
const getBooleanFromCategory = (cat) => {
    let res = false;
    if (cat.localeCompare("about") == 0) {
        res = true;
    }
    return res;
}

/**
 * Exports
 */
module.exports = controller;
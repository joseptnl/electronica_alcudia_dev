'use strict';

/**
 * Imports
 */
let express = require('express');
let nodemailer = require('nodemailer');

/**
 * Global variables
 */
const serviceName = 'Gmail';
const mailUser = 'joseptnl@gmail.com';
const mailPwd = 'vblrwnpklxqwoqek';
const mailReceiver = mailUser;

const messageController = {
    sendMessage: (req, res) => {
        const body = req.body;
        // Creating the message object
        let message = {
            name: body.name,
            email: body.email,
            subject: body.subject,
            text: body.text,
            check: body.check
        };
        // Checking the form validation
        if (message.name == "" ||
            message.email == "" ||
            !message.email.includes('@') ||
            message.subject == "" ||
            message.check == false) {
            return res.status(409).send({
                error: "Name, email, subject inputs aren't validated or the privacy policy hasn't been accepted"
            });
        }
        // Creating the transport object
        const transport = nodemailer.createTransport({
            service: serviceName,
            auth: {
                user: mailUser,
                pass: mailPwd
            }
        });
        const mailOptions = {
            from: message.email,
            to: mailReceiver,
            subject: message.subject,
            text: 
                `
                Nom: ${message.name}\n
                Email: ${message.email}\n
                ${message.text}
                `
        };
        transport.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(500).send({
                message: "Error sending the message",
                error: error
            });
            if (!info) return res.status(404).send({
                message: "The message couldn't be send"
            });
            return res.status(200).send({
                message: "The message has been send successfully",
                mail: info
            });
        });
    }
};

module.exports = messageController;

/**
 * Script for validate and submit the logging form 
 */

'use strict' 

/**
 * Module imports
 */
import {urlEncoder} from "./modules/urlEncoder.js";

document.addEventListener('DOMContentLoaded', () => {
    /**
     * VARIABLES
     */
    // DOM elements
    const inputs = document.getElementsByClassName('form__input');
    const button = document.getElementsByClassName('form__button')[0];
    // Program variables
    const localstorage = window.localStorage;
    
    /**
     * Program code
     */
    const main = () => {
        setEvents();
    };

    /**
     * Set the events
     */
    function setEvents () {
        // Form submiting event
        const form = document.getElementsByClassName('form')[0];
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            sendData(e.target, (res) => {
                window.location.href = "http://localhost:3000/admin/admin-page";   
            });
        });
    }

    /**
     * Sends the form data
     */
    function sendData (form, callback) {
        fetch("http://localhost:3000/admin/login" ,{
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formConversion(form)
        })
            .then(res => {
                if (res.status === 200) {
                    callback(res);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    /**
     * Converts a form into a data able to be send
     */
    function formConversion (form) {
        const data = new FormData(form);    // Converts the form to a form data object
        const dataJson = Object.fromEntries(data.entries());    // Converts the form data object to JSON
        return urlEncoder.encoder(dataJson);   // Encodes the data with the urlEncoder module help
    }

    // Main function
    main();
});
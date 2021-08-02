
/**
 * Script for validating the form data and sending it to
 * the API rest
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // GETTING DOM ELEMENTS
    const btn = document.getElementsByClassName('form__button')[0];
    const checkBox = document.getElementsByClassName('form__checkbox-btn')[0];
    const checkBoxTxt = document.getElementsByClassName('form__checkbox-lbl')[0];
    const emailAlert = document.getElementById('emailAlert');
    let inputs = document.getElementsByClassName('form__input');
    let emptyAlerts = document.getElementsByClassName('form__empty-alert');

    // Converting htmlCollections to arrays
    inputs = Array.prototype.slice.call(inputs);
    emptyAlerts = Array.prototype.slice.call(emptyAlerts);

    // Program variables
    let inputsValidation = [false, false, false, false];
    let wasEmpty = [true, true, true];
    const messageApiUrl = "http://localhost:3000/message";
    const sendRequestRoute = "/send"

    /**
     * Main logic function
     */
    const main = () => {
        setEventLIsteners();
    }

    /**
     * Set the event listeners 
     */
    function setEventLIsteners () {
        setFocusOutEvents();
        setButtonEvent();
        setCheckBoxEvent();
    }

    /**
     * Set the focusout events
     */
    function setFocusOutEvents () {
        for (let i = 0; i < 3; i++) {
            inputs[i].addEventListener('focusout', () => {
                inputValidator(i);
            });
        }
    }

    /**
     * Set the form button event to validate and send the data
     */
    function setButtonEvent () {
        btn.onclick = () => {
            for (let i = 0; i < 3; i++) {
                inputValidator(i);
            }
            // If the condition is satisfied the data will be send
            if (inputsValidation[0] &&
                inputsValidation[1] &&
                inputsValidation[2]) {
                if (checkBoxValidation()) {
                    sendData();
                    inputCleaner();
                } else {
                    setCheckboxAlert();
                }
            }
        }
    }

    /**
    * Set the checkbox label color to black
    */
    function setCheckBoxEvent () {
        checkBox.onclick = () => {
            checkBoxTxt.style.color = 'black';
        }
    }

    /**
     * Validates the checkbox value, if is checked returns true and if not
     * returns false
     */
    function checkBoxValidation () {
        return checkBox.checked;
    }

    /**
    * Sets the checkbox desactivated alert
    */
    function setCheckboxAlert () {
        checkBoxTxt.style.color = 'rgba(255, 50, 50,1.0)';
    }

    /**
     * Validates the input indicated by the index obtained by parameter
     * and shows or hides the alerts
     */
    function inputValidator (i) {
        if (inputs[i].value == "") {
            setAlertVisible(emptyAlerts[i]);
            wasEmpty[i] = true;
            inputsValidation[i] = false;
        } else {
            if (wasEmpty[i]) {
                setAlertInvisible(emptyAlerts[i]);
                wasEmpty[i] = false;
            }
            inputsValidation[i] = true;
            if (i == 1) {
                if (!inputs[i].value.includes('@')) {
                    setAlertVisible(emailAlert);
                    inputsValidation[i] = false;
                } else {
                    setAlertInvisible(emailAlert);
                    inputsValidation[i] = true;
                }
            }
        }
    }

    /**
     * Set the alert get by param to a block display
     */
    function setAlertVisible (alert) {
        alert.style.display = 'block';
    }

    /**
     * Set the alert get by param to a none display
     */
    function setAlertInvisible (alert) {
        alert.style.display = 'none';
    }

    /**
     * Cleans the form inputs and the checkbox by setting an empty
     * text and a false atribute respectively
     */
    function inputCleaner () {
        inputs.forEach(element => {
            element.value = "";
        });
        checkBox.checked = false;
    }

    /**
     * Sends the form data to the backend to be processed
     */
    function sendData () {
        const message = {
            name: inputs[0].value,
            email: inputs[1].value,
            subject: inputs[2].value,
            text: inputs[3].value
        };
        const encodedMessage = dataEncoder(message);
        sendRequest(encodedMessage, messageApiUrl, sendRequestRoute);
    }

    /**
     * Encode the data get by parameter
     * 
     * @param {*} data 
     * @returns 
     */
    function dataEncoder (data) {
        let result = "";
        let encodedData = [];
        for (let element in data) {
            let encodedKey = encodeURIComponent(element);
            let encodedValue = encodeURIComponent(data[element]);
            encodedData.push(encodedKey + "=" + encodedValue);
        }
        result = encodedData.join("&");
        return result;
    }

    /**
     * Send the http request
     * 
     * @param {*} dataToSend 
     * @param {*} baseUrl 
     * @param {*} routeUrl 
     */
    function sendRequest (dataToSend, baseUrl, routeUrl) {
        const http = new XMLHttpRequest();
        http.addEventListener('load', (event) => {
            alert("El formulari s'ha tramitat correctament");
        });
        http.addEventListener('error', (event) => {
            alert("S'ha produit un error al tramitar el formulari");
        });
        http.open("POST", baseUrl + routeUrl);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.send(dataToSend);
    }

    /**
     * Init
     */
    main();
});
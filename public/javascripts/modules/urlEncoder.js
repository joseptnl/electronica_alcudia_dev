
/**
 * MODULE: Sets the body data to be send with a Content-Type: application/x-www-form-urlencoded
 */

'use strict'

/**
 * Public interface to be exported
 */
const urlEncoder = {
    /**
     * Converts the data from the json get by param. to
     * an array within the specified content-type
     * @param {json} data 
     * Returns: string
     */
    encoder: (data) => {
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
};

/**
 * Exports
 */
export { urlEncoder };

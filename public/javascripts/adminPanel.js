
/**
 * Script to manage the admin panel page interacction
 */

'use strict'

document.addEventListener("DOMContentLoaded", () => {

    /**
     * GLOBAL SCOPE VARIABLES
     */
    
    const main = () => {
        addEventListeners();
    }

    function addEventListeners () {
        logoutBtnEvent((res) => {
            window.location.href = "http://localhost:3000/admin";
        });
    }

    function logoutBtnEvent (callback) {
        // Getting the DOM elements
        const logoutBtn = document.getElementById("logoutBtn");

        logoutBtn.onclick = (e) => {
            fetch("http://localhost:3000/admin/logout", {
                method: "GET",
                mode: "cors"
            })
                .then(res => {
                    if (res.status === 200) {
                        callback(res);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        };
    }

    /**
     * Program start
     */
    main();

});
'use strict'

document.addEventListener('DOMContentLoaded', () => {
    // VARIABLES
    // Primitive ones
    let arrowRotated = false;                   // To know if the arrow has been rotated

    // DOM elements
    const servicesArrow = document.getElementById('servicesArrow');
    const servicesTab = document.getElementById('servicesTab');
    const navResponsiveSubmenu = document.getElementsByClassName('nav__responsive-submenu')[0];
    const navResponsiveButton = document.getElementsByClassName('nav__responsive-button')[0];
    let navResponsiveMenuItem = document.getElementsByClassName('nav__responsive-menu-item');

    navResponsiveMenuItem = Array.prototype.slice.call(navResponsiveMenuItem);

    // Logic
    main();

    // Manages the main logic
    function main () {
        // Adding the services tab events
        servicesTab.addEventListener('click', () => {
            if (arrowRotated) { // If the arrow has been rotated
                arrowUpRotationAnimation();
                setServicesTabColor("black");
            } else {
                arrowDownRotationAnimation();
                setServicesTabColor("rgba(255, 165, 2,1.0)");
            }
            responsiveSubmenuToggler();
        });
        // Adding the open and close menu button event
        navResponsiveButton.onclick = () => {
            if (arrowRotated) {
                hideResponsiveSubmenu();
            }
            setMenuToggler();
        };
    }

    // ARROW DOWN ANIMATION
    function arrowDownRotationAnimation () {
        let interval = null;
        let rot = -90;
        clearInterval(interval);
        interval = setInterval(() => {
            if (rot == 0) {
                clearInterval(interval);
            } else {
                rot++;
                servicesArrow.style.transform = 'rotate('+rot+'deg)';
            }
        }, 5);
        arrowRotated = true;
    }

    // ARROW UP ANIMATION
    function arrowUpRotationAnimation () {
        let interval = null;
        let rot = 0;
        clearInterval(interval);
        interval = setInterval(() => {
            if (rot == -90) {
                clearInterval(interval);
            } else {
                rot--;
                servicesArrow.style.transform = 'rotate('+rot+'deg)';
            }
        }, 1);
        arrowRotated = false;
    }

    // ADDING THE TOGGLE EFFECT TO THE RESPONSIVE SUBMENU
    function responsiveSubmenuToggler () {
        navResponsiveSubmenu.classList.toggle('nav__responsive-submenu--collapsed');
    }

    // SET THE SERVICES TAB TEXT COLOR
    function setServicesTabColor (color) {
        servicesTab.style.color = color;
    }

    // SIMULATES THE (SLEEP) FUNCTION
    const customSleep = (delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, delay);
        });
    }

    // ADDING THE TOGGLE EFFECT TO THE MENU DISPLAY
    async function setMenuToggler () {
        for (let i = 0; i < navResponsiveMenuItem.length; i++) {
            navResponsiveMenuItem[i].classList.toggle('nav__responsive-menu-item--collapsed');
            await customSleep(80);
        }
    }

    function hideResponsiveSubmenu () {
        arrowUpRotationAnimation();
        setServicesTabColor("black");
        navResponsiveSubmenu.classList.add('nav__responsive-submenu--collapsed');
    }
});
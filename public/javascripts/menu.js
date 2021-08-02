'use strict'

document.addEventListener('DOMContentLoaded', () => {

    // VARIABLES
    // DOM elements
    const servicesArrow = document.getElementById('servicesArrow');
    const servicesTab = document.getElementById('servicesTab');
    const navResponsiveMenu = document.getElementsByClassName('nav__responsive-menu')[0];
    const navResponsiveSubmenu = document.getElementsByClassName('nav__responsive-submenu')[0];
    const navResponsiveButton = document.getElementsByClassName('nav__responsive-button')[0];
    const whereSubsection = document.getElementById('whereSubsection');
    let navResponsiveMenuItem = document.getElementsByClassName('nav__responsive-menu-item');
    // Sections
    let sections = document.getElementsByClassName('scroll');
    let servicesTargets = document.getElementsByClassName('service__target');
    // Nav buttons
    let menuButtons = document.getElementsByClassName('nav__menu-button');
    let submenuButtons = document.getElementsByClassName('nav__submenu-button');
    let responsiveMenuButtons = document.getElementsByClassName('nav__responsive-menu-button');
    let responsiveSubmenuButtons = document.getElementsByClassName('nav__responsive-submenu-button');
    // Footer buttons
    const toContact = document.getElementById('toContact');
    const toUbication = document.getElementById('toUbication');

    // Primitive ones
    let arrowRotated = false;                   // To know if the arrow has been rotated
    // Converting the htmlcollections to array
    sections = Array.prototype.slice.call(sections);
    servicesTargets = Array.prototype.slice.call(servicesTargets);
    menuButtons = Array.prototype.slice.call(menuButtons);
    submenuButtons = Array.prototype.slice.call(submenuButtons);
    responsiveMenuButtons = Array.prototype.slice.call(responsiveMenuButtons);
    responsiveSubmenuButtons = Array.prototype.slice.call(responsiveSubmenuButtons);
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
        // Adding the nav button events
        setEventListeners();
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
        navResponsiveMenu.classList.toggle('nav__responsive-menu--collapsed');
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

    function setEventListeners () {
        // Nav menu events
        let top = 0;
        for (let i = 0; i < menuButtons.length; i++) {
            menuButtons[i].addEventListener('click', () => {
                addScrollingEvent(sections, i, 'end');
            });
            responsiveMenuButtons[i].addEventListener('click', () => {
                addScrollingEvent(sections, i, 'end');
            });
        }
        for (let i = 0; i < submenuButtons.length; i++) {
            submenuButtons[i].addEventListener('click', () => {
                addScrollingEvent(servicesTargets, i, 'center');
            });
            responsiveSubmenuButtons[i].addEventListener('click', () => {
                addScrollingEvent(servicesTargets, i, 'center');
            });
        }
        toContact.onclick = () => {
            sections[3].scrollIntoView({
                block: 'end',
                behavior: 'smooth'
            });
        };
        toUbication.onclick = () => {
            whereSubsection.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        };
    }

    function addScrollingEvent (array, elemNumber, block) {
        hideResponsiveSubmenu(); //Hide the responsive submenu before hidding the menu
        setMenuToggler(); // Hide the responsive navigation menu
        array[elemNumber].scrollIntoView({ 
            behavior: 'smooth',
            block: block 
        });
    }
});
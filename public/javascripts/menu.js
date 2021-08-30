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
    // Carousel status
    let carouselsStatus = [];

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
    function main() {
        // Setting the carousel
        setCarousels();
        // Set catalogues
        setCatalogues();
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
    function arrowDownRotationAnimation() {
        let interval = null;
        let rot = -90;
        clearInterval(interval);
        interval = setInterval(() => {
            if (rot == 0) {
                clearInterval(interval);
            } else {
                rot++;
                servicesArrow.style.transform = 'rotate(' + rot + 'deg)';
            }
        }, 5);
        arrowRotated = true;
    }

    // ARROW UP ANIMATION
    function arrowUpRotationAnimation() {
        let interval = null;
        let rot = 0;
        clearInterval(interval);
        interval = setInterval(() => {
            if (rot == -90) {
                clearInterval(interval);
            } else {
                rot--;
                servicesArrow.style.transform = 'rotate(' + rot + 'deg)';
            }
        }, 1);
        arrowRotated = false;
    }

    // ADDING THE TOGGLE EFFECT TO THE RESPONSIVE SUBMENU
    function responsiveSubmenuToggler() {
        navResponsiveSubmenu.classList.toggle('nav__responsive-submenu--collapsed');
    }

    // SET THE SERVICES TAB TEXT COLOR
    function setServicesTabColor(color) {
        servicesTab.style.color = color;
    }

    // SIMULATES THE (SLEEP) FUNCTION
    const customSleep = (delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, delay);
        });
    }

    // ADDING THE TOGGLE EFFECT TO THE MENU DISPLAY
    async function setMenuToggler() {
        navResponsiveMenu.classList.toggle('nav__responsive-menu--collapsed');
        for (let i = 0; i < navResponsiveMenuItem.length; i++) {
            navResponsiveMenuItem[i].classList.toggle('nav__responsive-menu-item--collapsed');
            await customSleep(80);
        }
    }

    function hideResponsiveSubmenu() {
        arrowUpRotationAnimation();
        setServicesTabColor("black");
        navResponsiveSubmenu.classList.add('nav__responsive-submenu--collapsed');
    }

    function setEventListeners() {
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

    function addScrollingEvent(array, elemNumber, block) {
        hideResponsiveSubmenu(); //Hide the responsive submenu before hidding the menu
        setMenuToggler(); // Hide the responsive navigation menu
        array[elemNumber].scrollIntoView({
            behavior: 'smooth',
            block: block
        });
    }

    async function setCarousels() {
        // Getting the carousels
        let carouselElements = document.getElementsByClassName("carousel");
        carouselElements = Array.prototype.slice.call(carouselElements);
        // Loading slides
        let images = [];
        carouselElements.forEach(async (carousel, index) => {
            let response = await fetch(
                "http://localhost:3000/admin/get-images/" + getCategoryByIndex(index),
                {
                    method: "GET",
                    mode: "cors"
                }
            );
            response = await response.json();
            images.push(response.result);
            const pointsContainer = carousel.getElementsByClassName("points-container")[0];
            let slidesContainer = document.createElement("div");
            slidesContainer.classList.add("slide-container");
            slidesContainer.style.width = `${images[index].length * 100}%`;
            images[index].forEach((elem, imageIndex) => {
                const point = document.createElement("li");
                if (imageIndex === 0) point.classList.add("point-active");
                pointsContainer.append(point);
                let slide = document.createElement("div");
                slide.classList.add("slide");
                slide.style.width = `calc(100% / ${images[index].length})`;
                slide.innerHTML = `
                    <img src="../uploads/images/${elem.url}" alt="${elem.alt}">
                `;
                slidesContainer.append(slide);
            });
            carousel.append(slidesContainer);
            carouselsStatus.push(0);
            // Setting the movement events
            addMovementEvents(carousel, index, images[index]);
        });
    }

    function addMovementEvents(carousel, carouselIndex, images) {
        if (images.length > 1) {
            let movementButtons = carousel.getElementsByClassName("movement-button");
            movementButtons = Array.prototype.slice.call(movementButtons);
            let pointElements = carousel.getElementsByTagName("li");
            pointElements = Array.prototype.slice.call(pointElements);
            const slidesContainer = carousel.getElementsByClassName("slide-container")[0];
            const movement = -(100 / images.length);
            movementButtons.forEach((btn, btnIndex) => {
                btn.style.display = "flex";
                btn.onclick = () => {
                    setArrowMovement(carouselIndex, slidesContainer, btnIndex, images, movement, pointElements);
                };
            });
            pointElements.forEach((point, pointIndex) => {
                point.onclick = () => {
                    carouselsStatus[carouselIndex] = pointIndex;
                    slidesContainer.style.transform = `translateX(${carouselsStatus[carouselIndex] * movement}%)`;
                    setActivePoint(carouselsStatus[carouselIndex], pointElements);
                }
            });
        }
    }

    function setArrowMovement(carouselIndex, slidesContainer, movementDirection, images, movement, pointElements) {
        if (movementDirection === 0) {
            if (carouselsStatus[carouselIndex] > 0) {
                carouselsStatus[carouselIndex]--;
                slidesContainer.style.transform = `translateX(${carouselsStatus[carouselIndex] * movement}%)`;
            }
        } else {
            if (carouselsStatus[carouselIndex] < images.length - 1) {
                carouselsStatus[carouselIndex]++;
                slidesContainer.style.transform = `translateX(${carouselsStatus[carouselIndex] * movement}%)`;
            }
        }
        setActivePoint(carouselsStatus[carouselIndex], pointElements);
    }

    function setActivePoint (actualStatus, pointElements) {
        pointElements.forEach((point, index) => {
            point.classList.remove("point-active");
            if (index === actualStatus) point.classList.add("point-active");
        });
    }

    /**
     * Set the catalogues
     */
    function setCatalogues () {
        const modal = document.getElementsByClassName("modal")[0];
        const openButton = document.getElementById("downloadIconContainer");
        const closeButton = modal.getElementsByClassName("close-button")[0];
        setCatloguesModalOpenEvent(openButton, modal);
        setCatloguesModalCloseEvent(closeButton, modal);
        loadCatalogues(modal);
    }

    function setCatloguesModalOpenEvent (openButton, modal) {
        openButton.onclick = () => {
            modal.style.display = "flex";
        };
    }

    function setCatloguesModalCloseEvent (closeButton, modal) {
        closeButton.onclick = () => {
            modal.style.display = "none";
        };
    }

    async function loadCatalogues (modal) {
        const cataloguesList = document.getElementById("cataloguesList");
        let response = await fetch(
            "http://localhost:3000/admin/get-catalogues",
            {
                method: "GET",
                mode: "cors"
            }
        );
        response = await response.json();
        const catalogues = response.result;
        catalogues.forEach((catalogue, index) => {
            const url = "./uploads/catalogues/"+catalogue.url;
            const card = document.createElement("li");
            card.classList.add("card");
            card.innerHTML = `
                <div class="information">
                    <i class="far fa-file-pdf"></i>
                    <p>${catalogue.title}</p>
                </div>
                <div class="buttons">
                    <a href="${url}" 
                        download="${catalogue.title}"
                        class="button-container">
                        <i class="fas fa-file-download"></i>
                    </a>
                    <a href="${url}" 
                        class="button-container"
                        target="_blank">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            `;
            cataloguesList.append(card);
        });
    }

    function getCategoryByIndex(i) {
        let category = "about";
        if (i === 1) category = "catalogue";
        return category;
    }
});
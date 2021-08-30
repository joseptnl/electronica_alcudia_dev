
/**
 * Script to manage the admin panel page interacction
 */

'use strict'

document.addEventListener("DOMContentLoaded", () => {

    /**
     * GLOBAL SCOPE VARIABLES
     */
    let categoryFocused = 0;

    const main = () => {
        loadContainers();
        addEventListeners();
    }

    function loadContainers () {
        let miniaturesContainerElements = document.getElementsByClassName("miniaturesContainer");
        miniaturesContainerElements = Array.prototype.slice.call(miniaturesContainerElements);
        const cataloguesContainer = document.getElementsByClassName("cataloguesContainer")[0];
        loadCataloguesContainer(cataloguesContainer);
        miniaturesContainerElements.forEach((container, index) => {
            categoryFocused = index;
            loadMiniaturesContainer(miniaturesContainerElements);
        });
    }

    /**
     * Add events with all the interactions
     */
    function addEventListeners () {
        const logoutBtn = document.getElementById("logoutBtn");
        const closeImageSelectDialogBtn = document.getElementById("imageSelectCancel");
        const closeCatalogueSelectDialogBtn = document.getElementById("catalogueSelectCancel");
        const addBtn = document.getElementById("imageSelectAdd");
        const addCatalogueBtn = document.getElementById("catalogueSelectAdd");
        const imageSelectDialog = document.getElementById("imageSelectDialogContainer");
        const catalogueSelectDialog = document.getElementById("catalogueSelectDialogContainer");
        const cataloguesContainer = document.getElementsByClassName("cataloguesContainer")[0];
        let openImageSelectDialogBtns = document.getElementsByClassName("addImageBtn");
        openImageSelectDialogBtns = Array.prototype.slice.call(openImageSelectDialogBtns);
        let miniaturesContainerElements = document.getElementsByClassName("miniaturesContainer");
        miniaturesContainerElements = Array.prototype.slice.call(miniaturesContainerElements);
        let tabBtns = document.getElementsByClassName("tab");
        tabBtns = Array.prototype.slice.call(tabBtns);
        let sections = document.getElementsByClassName("section");
        sections = Array.prototype.slice.call(sections);
        let openCatalogueSelectDialogBtns = document.getElementsByClassName("addCatalogueBtn");
        openCatalogueSelectDialogBtns = Array.prototype.slice.call(openCatalogueSelectDialogBtns);

        addTabsTogglerEvent(tabBtns, sections);

        addLogout(logoutBtn);
        openDialog(openImageSelectDialogBtns, imageSelectDialog);
        openDialog(openCatalogueSelectDialogBtns, catalogueSelectDialog);
        closeDialog(closeImageSelectDialogBtn, imageSelectDialog);
        closeDialog(closeCatalogueSelectDialogBtn, catalogueSelectDialog);
        addImage(addBtn, imageSelectDialog, miniaturesContainerElements);
        addCatalogue(addCatalogueBtn, catalogueSelectDialog, cataloguesContainer);
    }

    /**
     * Events that comunicates with the REST API
     */
    /**
     * Add an event consisting on calling the logout function from 
     * the API to exit from the running session.
     * @param {*} logoutBtn 
     */
    function addLogout(logoutBtn) {
        logoutBtn.onclick = async () => {
            const res = await fetch(
                "http://localhost:3000/admin/logout",
                {
                    method: "GET",
                    mode: "cors"
                }
            );
            if (res.status === 200) {
                window.location.href = "http://localhost:3000/admin";
            }
        };
    }

    function addImage (button, dialog, miniaturesContainerElements) {
        button.onclick = async () => {
            const data = {
                image: document.getElementById("selectImageInput").files[0],
                alt: document.getElementById("setAltInput").value,
                category: getCategoryByIndex(categoryFocused)
            }
            let formData = new FormData();
            formData.append("image", data.image);
            formData.append("alt", data.alt);
            formData.append("category", data.category);
            const res = await fetch(
                "http://localhost:3000/admin/save-image",
                {
                    method: "POST",
                    mode: "cors",
                    body: formData
                }
            );
            if (res.status === 200) {
                loadMiniaturesContainer(miniaturesContainerElements);
            }
            dialog.style.display = "none";
        };
    }

    async function loadMiniaturesContainer (miniaturesContainerElements) {
        const categoryIndex = categoryFocused;
        const miniaturesContainer = miniaturesContainerElements[categoryIndex];
        if (!(miniaturesContainer.childNodes.length === 0)) miniaturesContainer.innerHTML = ``; 
        const category = getCategoryByIndex(categoryIndex);
        let res = await fetch(
            "http://localhost:3000/admin/get-images/"+category, 
            {
                method: "GET",
                mode: "cors"
            }
        );
        res = await res.json();
        const result = res.result;
        result.forEach((elem, index) => {
            const element = document.createElement("div");
            element.classList.add("imageMiniature");
            element.innerHTML = `
                    <img src="../uploads/images/${elem.url}", alt=${elem.alt}>
                    <p>${elem.name}</p>
                    <div class="deleteBtnContainer">
                        <i class="deleteBtn far fa-trash-alt"></i>
                    </div>
                `;
            miniaturesContainer.appendChild(element);

            const deleteImageBtn = element.getElementsByClassName("deleteBtnContainer")[0];
            addDeleteImageEvent(deleteImageBtn, miniaturesContainerElements, elem.url);
        });
    }

    function addDeleteImageEvent (button, miniaturesContainerElements, url) {
        button.onclick = async () => {
            const res = await fetch(
                "http://localhost:3000/admin/delete-image/"+url,
                {
                    method: "GET",
                    mode: "cors"
                }
            );
            if (res.status === 200) {
                const container = button.parentNode.parentNode;
                miniaturesContainerElements.forEach((elem, index) => {
                    if (elem.isSameNode(container)) categoryFocused = index;
                });
                loadMiniaturesContainer(miniaturesContainerElements);
            }
        }
    }

    function addCatalogue (button, dialog, container) {
        button.onclick = async () => {
            const formData = new FormData();
            formData.append("catalogue", document.getElementById("selectCatalogueInput").files[0]);
            formData.append("title", document.getElementById("setTitleInput").value);
            formData.append("expiryDate", document.getElementById("setExpiryDateInput").value);
            const res = await fetch(
                "http://localhost:3000/admin/save-catalogue",
                {
                    method: "POST",
                    mode: "cors",
                    body: formData
                }
            );
            if (res.status === 200) {
                loadCataloguesContainer(container);
            }
            dialog.style.display = "none";
        }
    }

    async function loadCataloguesContainer (container) {
        let res = await fetch(
            "http://localhost:3000/admin/get-catalogues", 
            {
                method: "GET",
                mode: "cors"
            }
        );
        if (res.status === 200) {
            container.innerHTML = ``;
            res = await res.json();
            const result = res.result;
            if (!result) return;
            result.forEach((elem, index) => {
                const element = document.createElement("div");
                element.classList.add("catalogueMiniature");
                element.innerHTML = `
                        <div id="pdfIconContainer">
                            <i class="far fa-file-pdf"></i>
                        </div>
                        <p>${elem.title}</p>
                        <div class="deleteBtnContainer">
                            <i class="deleteBtn far fa-trash-alt"></i>
                        </div>
                    `;
                container.appendChild(element);
                const deleteCatalogueBtn = element.getElementsByClassName("deleteBtnContainer")[0];
                addDeleteCatalogueEvent(deleteCatalogueBtn, elem.url, container);
            });
        }
    }

    function addDeleteCatalogueEvent (button, url, container) {
        button.onclick = async () => {
            const res = await fetch(
                "http://localhost:3000/admin/delete-catalogue/"+url,
                {
                    method: "GET",
                    mode: "cors"
                }
            );
            if (res.status === 200) {
                loadCataloguesContainer(container);
            }
        }
    }

    /**
     * Events that only interacts with DOM
     */
    /**
     * Open the dialog through the buttons passed by parameter.
     * @param {*} buttons 
     * @param {*} dialog 
     */
    function openDialog(buttons, dialog) {
        buttons.forEach((btn, i) => {
            btn.onclick = () => {
                categoryFocused = i;
                dialog.style.display = "flex";
            }
        });
    }

    /**
     * Close the dialog through the button passed by parameter
     * @param {*} button 
     * @param {*} dialog 
     */
    function closeDialog(button, dialog) {
        button.onclick = () => {
            dialog.style.display = "none";
        }
    }

    function addTabsTogglerEvent (tabBtns, sections) {
        loadSection(0, sections);
        setTabActive(0, tabBtns);
        tabBtns.forEach((btn, index) => {
            btn.onclick = () => {
                setTabActive(index, tabBtns);
                loadSection(index, sections);
            };
        });
    }

    function loadSection (sectionIdx, sections) {
        sections[sectionIdx].style.display = "block";
        sections.forEach((section, index) => {
            if (sectionIdx != index) section.style.display = "none";
        });
    }

    function setTabActive (tabIdx, tabBtns) {
        tabBtns[tabIdx].classList.add("tab--active");
        tabBtns.forEach((tab, index) => {
            if (tabIdx != index) tab.classList.remove("tab--active");
        });
    }

    /**
     * Auxiliar functions
     */
    function getCategoryByIndex(i) {
        let category = "about";
        if (i === 1) category = "catalogue";
        return category;
    }

    /**
     * Program start
     */
    main();

});
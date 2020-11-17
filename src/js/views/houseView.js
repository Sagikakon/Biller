import { DOM } from "../models/DOM";
import { curr } from "../script";
import { getResFirstName } from "./residentsView";


export const addBlurBackground = () => {
    DOM.wrapperDOM.classList.add('blur');
    DOM.headerDOM.classList.add('blur');
    document.body.style.overflow = "hidden";
}

export const removeBlurBackground = () => {
    DOM.wrapperDOM.classList.remove('blur');
    DOM.headerDOM.classList.remove('blur');
    document.body.style.overflow = "visible";
}

DOM.houseBtnDOM.addEventListener('click', () => {
    DOM.houseOutDOM.style.display = 'flex'
    addBlurBackground();
    renderHouseDetailsUI();
});


export const clearInputHouse = () => {
    resetCheckBoxUI();
    DOM.houseOutDOM.style.display = 'none'
    removeBlurBackground();
}

export const resetCheckBoxUI = () => {
    const checkArr = document.querySelectorAll('.fa-check');

    DOM.userPasswordDOM.type = "password";

    if (checkArr) {
        checkArr.forEach(el => {
            el.parentElement.previousElementSibling.readOnly = true;
            el.className = "fas fas fa-edit";
        });
    }
}



export const renderHouseDetailsUI = () => {

    DOM.houseNameDOM.value = curr.house.name;
    DOM.houseAddressDOM.value = curr.house.address;
    DOM.housePostalDOM.value = curr.house.postal;
    DOM.houseResidentsDOM.value = getResFirstName();
}

export const toggleCheckBox = el => {
    if (el.target.className.includes('fa-')) {
        if (el.target.className.includes('edit')) {
            resetCheckBoxUI();
            
            if (el.target.id === "password-edit") {
                const verifyPass = prompt("what password?");
                if (verifyPass === curr.user.password) {
                    DOM.userPasswordDOM.type = "text"
                    makeInputEdit(el);
                }
                else
                    alert("wrong password")
            }

            else {
                makeInputEdit(el);
            }
        }
        else {
            if (el.target.id === "password-edit")
                DOM.userPasswordDOM.type = "password";

            el.target.parentElement.previousElementSibling.readOnly = true;
            el.target.className = "fas fa-edit";
        }
    }
}

const makeInputEdit = (el) => {
    el.target.parentElement.previousElementSibling.readOnly = false;
    el.target.parentElement.previousElementSibling.select();
    el.target.className = "fas fas fa-check";
}

export const removeLoading = () => {
    DOM.mainSiteSectionDOM.classList.remove("blur");
    DOM.loadingScreenSectionDOM.hidden = true;
}
import { DOM } from './models/DOM';
import { residentsUI } from './views/residentsView';
import { renderSpsifick } from './views/listsView';
import { copyMonthlyPayments } from './controllers/listsCtrl';
import firebase from './firebase.js';
import { convertAllUsersToUserData } from './controllers/houseCtrl';
import { getCurrentUserFromFirebase, getHouseholdFromFirebase, getMonthFromFirebase, getUniqIdFromFirebase, resetMonthFirebase, setIdFirebaseData } from "./controllers/dataBaseCtrl";
import { removeLoading } from './views/houseView';
import { initUnpaidWarning, renderDateUI } from './views/dateView';
import { initDarkMode } from './views/darkModView';
import { } from './controllers/statsCtrl'

// GLOBAL VARIABLE

let uniqIdCounter;
let databaseMonth = null;
export let curr = {};

window.curr = curr;
window.uniqIdCounter = uniqIdCounter;
window.databaseMonth = databaseMonth;

export const incID = async () => {
    uniqIdCounter++;
    setIdFirebaseData(uniqIdCounter);
}

export const getID = () => {
    return uniqIdCounter;
}

export const getLocalMonth = () => {
    return databaseMonth;
}

export const setLocalMonth = (month) => {
    databaseMonth = month;
}

export const moveToSite = () => {
    DOM.welcomeSectionDOM.hidden = true;
    DOM.mainSiteSectionDOM.style.opacity = "1";
    DOM.loadingScreenSectionDOM.hidden = false;
    firstInit();
}

export const initWelcomeScreen = () => {
    const notFirstTime = localStorage.getItem("notFirstTime");

    if (notFirstTime == "true")
        moveToSite();

    else
        DOM.welcomeSectionDOM.style.opacity = "1";
}

DOM.moveToSiteDOM.addEventListener('click', () => {    
    localStorage.setItem("notFirstTime", true);
    moveToSite();
})

let firstInit = async () => {
    initDarkMode();
    await getHouseholdFromFirebase();
    await resetMonthFirebase();
    uniqIdCounter = await getUniqIdFromFirebase();
    databaseMonth = await getMonthFromFirebase();
    convertAllUsersToUserData();
    await getCurrentUserFromFirebase();
    await copyMonthlyPayments();
    renderSpsifick();
    residentsUI();
    renderDateUI();
    initUnpaidWarning();
    removeLoading();
}

initWelcomeScreen();

// Event listener - controller function -- genral controller.
DOM.disconnectDOM.addEventListener('click', () => {
    if (confirm("Do you want to be transferred to the information screen?")) {
        document.getElementById('main-site').hidden = true;
        document.getElementById('goodbye-screen').hidden = false;
    }
});

/* TOGGLE HAMBURGER MENU OPEN AND CLOSE MOBILE */

document.querySelector('.mobile-nav__btn').addEventListener('click', () => {
    const navItems = document.querySelector('.site-nav').children;
    const menuIsClosed = document.querySelector('.site-nav').className.includes('closed');
    

    if (menuIsClosed) {
        document.querySelector('.mobile-nav__btn').style.width = "30px";
        document.querySelector('.mobile-nav__btn').style.borderWidth = "1px";
        document.querySelector('.mobile-nav__btn').firstChild.style.transform = "rotate(180deg)";

        for (let i = 0; i < navItems.length - 1; i++) {
            setTimeout(() => {
                navItems[i].style.opacity = "1";
                navItems[i].style.left = `${(i*30)}px`;
    
            }, (i+1)*150);
        }

        document.querySelector('.site-nav').classList.remove('site-nav--closed');
    }

    else {
        document.querySelector('.mobile-nav__btn').style.width = "10px";
        document.querySelector('.mobile-nav__btn').style.borderWidth = "0px";
        document.querySelector('.mobile-nav__btn').firstChild.style.transform = "rotate(0)";

        for (let i = navItems.length-2; i >= 0; i--) {
            setTimeout(() => {
                navItems[i].style.opacity = "0";
                navItems[i].style.left = `150px`;
    
            }, (navItems.length-2-i)*150);
        }

        document.querySelector('.site-nav').classList.add('site-nav--closed');
    }
});

document.querySelector('.mobile-nav__expand-btn').addEventListener('click', () => {
    const menuIsClosed = document.querySelector('.mobile-nav__expand-btn').firstChild.className.includes('plus');

    if (menuIsClosed) {
        document.querySelector('.blue').style.transform = "translateY(0)";
        document.querySelector('.mobile-nav__expand-btn').firstChild.className = "fas fa-minus-circle"
    }

    else {
        document.querySelector('.blue').style.transform = "translateY(-100%)";
        document.querySelector('.mobile-nav__expand-btn').firstChild.className = "fas fa-plus-circle"
    }
})
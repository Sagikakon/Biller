import { DOM } from "../models/DOM";
import { addBlurBackground, toggleCheckBox } from "../views/houseView";
import { setCurrentUserAtfirebaseData, setUserFirebaseData } from "./dataBaseCtrl";
import { renderUserDetailsUI, clearInputUser, updateSelectedImages, renderUserErorUI, checkUserInput } from "../views/userView";
import { deleteAllListUI, renderSpsifick } from "../views/listsView";
import { freshResList, removeJiggle, toggleJiggle } from "../views/residentsView";
import { getUser } from "../views/expensView";



// Event listener - controller function
DOM.resListWrapperDOM.addEventListener('click', el => {
    if (el.target === DOM.manageDOM)
        toggleJiggle();
    

    if (el.target.className.includes("jiggle")) {
        const resID = el.target.closest(".resident").id;
        const resident = getUser(resID);
        const confirmation = confirm(`Do you want to make ${resident.firstName} the current user?`);

        if (confirmation) {
            curr.user = resident;
            setCurrentUserAtfirebaseData(resID);
            removeJiggle();
            updateCurrUser();
            deleteAllListUI();
            renderSpsifick();
            freshResList();
        }
    }
});

DOM.userBtnDOM.addEventListener('click', () => {    
    DOM.userProfileImageDOM.src = curr.user.image;
    DOM.userOutDOM.style.display = 'flex'
    addBlurBackground();
    renderUserDetailsUI();
    updateSelectedImages();
});


DOM.userOutDOM.addEventListener('click', el => {
    toggleCheckBox(el);
    if (el.target === DOM.userCancelBtnDOM) {
        clearInputUser();
    }

    if (el.target === DOM.userSaveBtnDOM ) {
        let checkInput = checkUserInput();
        if (checkInput === 'approve') {
            setUserFirebaseData();
            setUserData();
            clearInputUser();
            updateCurrUser();
            deleteAllListUI();
            renderSpsifick();
            freshResList();
        }else{
            renderUserErorUI(checkInput);
        }
    }
});

export const updateCurrUser = () => {
    curr.house.userArr.forEach(el => {
        if (el.userID === curr.user.userID) {
            el = Object.assign(el, curr.user);
        }
    });
}

const setUserData = () => {
    curr.user.firstName = DOM.userFirstNameDOM.value;
    curr.user.lastName = DOM.userLastNameDOM.value;
    curr.user.userName = DOM.userNameDOM.value;
    curr.user.password = DOM.userPasswordDOM.value;
    curr.user.image = DOM.userProfileImageDOM.src;
}
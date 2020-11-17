import { DOM } from "../models/DOM";
import { curr } from "../script";
import { removeBlurBackground, resetCheckBoxUI } from "../views/houseView";


export const renderUserDetailsUI = () => {
    DOM.userFirstNameDOM.value = curr.user.firstName;
    DOM.userLastNameDOM.value = curr.user.lastName;
    DOM.userNameDOM.value = curr.user.userName;
    DOM.userPasswordDOM.value = curr.user.password;
}

export const clearInputUser = () => {
    resetCheckBoxUI();
    DOM.userOutDOM.style.display = 'none'
    removeBlurBackground();
}

const resetProfileOptions = optionElement => {
    optionElement.style.filter = "none";
    optionElement.style.pointerEvents = "auto";
}

export const updateSelectedImages = () => {
    const allImages = document.querySelectorAll('.profile__pic__option');
    const allImagesArray = Array.from(allImages);
    
    allImagesArray.forEach(el => {
        resetProfileOptions(el);
    })

    curr.house.userArr.forEach(el => {
        let imageElement = allImagesArray.find( elImage => {
            return el.image === elImage.src;
        })

        imageElement.style.filter = "grayscale(100%)";
        imageElement.style.pointerEvents = "none";
    })
}

DOM.profileImageTableDOM.addEventListener('click', el => {
    if (el.target.className === 'profile__pic__option') {
        DOM.userProfileImageDOM.src = el.target.src;
    }
});


export const reMarkUserForPay = () => {
    let graySelectorsArr = document.querySelectorAll('.selector');
    for (let i = 0; i < graySelectorsArr.length; i++) {
        graySelectorsArr[i].classList.remove('selected');
    }
    for (let i = 0; i < graySelectorsArr.length; i++) {
        graySelectorsArr[i].addEventListener('click', el => {
            el.target.classList.toggle('selected');
        });
    }
}

export const renderUserErorUI = (checkInput) => {
    switch (checkInput) {

        case 'firstName':
            alert('First name must have a value! \nPlease try again.')
            break;

        case 'firstNameNum':
            alert('First name cannot contain numbers \nPlease try again.')
            break;

        case 'userName':
            alert('Username must have a value! \nPlease try again.')
            break;

        case 'password':
            alert('Password must have a value! \nPlease try again.')
            break;

        case 'email':
            alert('Username must have a valid email \nPlease try again.')
            break;
    }
}

export const checkUserInput = () => {
    if(!DOM.userFirstNameDOM.value){
        return 'firstName';
    }
    
    if(DOM.userFirstNameDOM.value){
       const str =  DOM.userFirstNameDOM.value;
       if(/\d/.test(str)){
           return 'firstNameNum'
       }
    }

    if(!DOM.userNameDOM.value){
        return 'userName';

    }if(DOM.userNameDOM.value) {
        if(!checkIfEmail(DOM.userNameDOM.value)){
            return 'email';
        }
    }

    if (!DOM.userPasswordDOM.value) {
        return 'password';
    }

    return 'approve'
}

const checkIfEmail = (email) => {
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return false;
    }
    return true;
}
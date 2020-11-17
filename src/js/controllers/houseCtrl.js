import { curr } from '../script';
import { DOM } from "../models/DOM";
import UserData from "../models/UserData";
import { setHouseFirebaseData } from "./dataBaseCtrl";
import { clearInputHouse, resetCheckBoxUI, toggleCheckBox} from "../views/houseView";
import { getFilterByMonthList } from './listsCtrl';
import { toggleListDelete } from '../views/listsView';
import { removeJiggle } from '../views/residentsView';

export const convertAllUsersToUserData = () => {
    for (let i = 0; i < curr.house.userArr.length; i++){
        curr.house.userArr[i] = Object.assign(new UserData(), curr.house.userArr[i]);
    }
}

export const getMonthlyPayment = () => {
    let monthlyPaymentList = [];
    let filteredList = getFilterByMonthList();

    filteredList.forEach(el => {
        if (el.type) {
             monthlyPaymentList.push(el);;
        }
    });
    return monthlyPaymentList;
}

export const getManualyPayment = () => {
    let manualPaymentList = [];
    let filteredList = getFilterByMonthList();

    filteredList.forEach(el => {
        if (!el.type) {
             manualPaymentList.push(el);;
        }
    });
    return manualPaymentList;
}

export const getPayment = (id) => {
   let payment = null;

    for (let i = 0; i < curr.house.paymentsListArr.length; i++) {
        if (curr.house.paymentsListArr[i].id === id) {
            payment =  curr.house.paymentsListArr[i];
        }
    }
    
    return payment;
}

export const sumList = (list) => {
    let sumList = 0;
    
    list.forEach(el => {
        sumList += el.sum;
    });

    return sumList;
}

DOM.houseOutDOM.addEventListener('click', el => {
    toggleCheckBox(el);
    if (el.target === DOM.houseCancelBtnDOM) {
        clearInputHouse();
    }

    if (el.target === DOM.houseSaveBtnDOM) {
        if (DOM.houseNameDOM.value) {
            setHouseFirebaseData();
            setHouseData();
            clearInputHouse();
        }
        else{
            alert('Household name must have a value!\nPlease try again.');
        }
    }
});

DOM.bodyDOM.addEventListener('click', el => {
    if (!el.target.classList.value.includes('list__edit')) {

        if (!el.target.classList.value.includes('fa-ban')) {
            if (DOM.manualyEditDOM.textContent === 'Done')
                toggleListDelete(false)

            if (DOM.monthlyEditDOM.textContent === 'Done')
                toggleListDelete(true)
        }
    }
    
    if (!el.target.id.includes('mon__filter'))
        DOM.monthlyDropDOM.style.display = "none";        
    
    if (!el.target.id.includes('man__filter'))
        DOM.manualyDropDOM.style.display = "none";        
    
    if (document.querySelectorAll('.jiggle')) {
        if(!(el.target === DOM.manageDOM))
            removeJiggle();

        else {
            if(DOM.manageDOM.textContent === 'Manage')
                removeJiggle();
        }
    }

    if(!el.target.classList.value.includes('fa-check'))
        resetCheckBoxUI();
});

const setHouseData = () => {
    curr.house.name = DOM.houseNameDOM.value;
    DOM.houseHoldDOM.textContent = curr.house.name;
    curr.house.address = DOM.houseAddressDOM.value;
    curr.house.postal = parseInt(DOM.housePostalDOM.value);
}
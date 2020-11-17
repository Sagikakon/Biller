import { DOM } from '../models/DOM';
import { paymentUI, totalToPayUI } from './expensView';
import { getManualyPayment, getMonthlyPayment, sumList } from '../controllers/houseCtrl';
import { getLocalMonth } from '../script';

const SECOND_ELEMENT = 2;

// view function - used in add payment && and in edit listener -- lists view.
export const toggleListDelete = (isMon) => {
    let mark = '';

    if (isMon) {
        mark = 'mon-';
    }

    const test = document.querySelectorAll(`.${mark}item-delete-btn`);
    const pay = document.querySelectorAll(`.${mark}did-pay`);

    for (let i = 0; i < test.length; i++) {
        test[i].classList.toggle('show');
    }

    for (let i = 0; i < pay.length; i++) {
        pay[i].classList.toggle('animate-pay');
    }

    if (document.querySelector(`.${mark}edit`).textContent === 'Edit')
        document.querySelector(`.${mark}edit`).textContent = 'Done';

    else
        document.querySelector(`.${mark}edit`).textContent = 'Edit';
}

//view function -- lists view
const filterSwitchDOM = (listType, Event) => {
    let newChild, oldChild, iconDrop;
    oldChild = Event.target.closest('.dropdown').firstElementChild;
    iconDrop = oldChild.firstElementChild
    newChild = Event.target.closest('.filter');

    if (listType.style.display == "block") {
        if (oldChild === newChild) {
            listType.style.display = "none";
            return newChild;
        }

        else {
            oldChild.removeChild(iconDrop);
            oldChild = Event.target.closest('.dropdown').replaceChild(newChild, oldChild);
            newChild.insertAdjacentElement('beforeend', iconDrop);
            listType.insertAdjacentElement('beforeend', oldChild);
            listType.style.display = "none";
            return newChild;
        }
    }

    else {
        listType.style.display = "block";
    }
}

// interal function -- lists view.
export const renderPaymentUI = (list, requestedMonth) => {
    if (list) {
        let filteredList = list.filter(el => {
            return el.month === requestedMonth;
        });
        
        filteredList.forEach(el => {
            paymentUI(el);
        });
    }
}

//view function -- lists view
export const toggleFiltersUI = Event => {
    let filterElement;

    if (Event.target.id.includes('mon__filter')) {
        filterElement = filterSwitchDOM(DOM.monthlyDropDOM, Event);
    }
    else if (Event.target.id.includes('man__filter')) {
        filterElement = filterSwitchDOM(DOM.manualyDropDOM, Event);
    }

    return filterElement;
}

//view function -- lists view
export const deleteListUI = list => {
    let listToDelete;
    list === 'mon__filter' ? listToDelete = DOM.monthlyPayDOM : listToDelete = DOM.manualyPayDOM;
    listToDelete.textContent = '';
}

export const deleteAllListUI = () => {
    deleteListUI('mon__filter');
    deleteListUI('man__filter');
}

export const renderSpsifick = () => {
    switchPaymentUI(DOM.dropdownMonthDOM.firstElementChild)
    switchPaymentUI(DOM.dropdownManualDOM.firstElementChild)
}

export const switchPaymentUI = (filterElement) => {
    switch (filterElement.classList[SECOND_ELEMENT]) {
        case 'view__mine':
            if (filterElement.id === 'mon__filter') {
                renderPaymentUI(curr.user.getMonthlyOwner(), getLocalMonth());
                totalToPayUI(true, curr.user.sumMine(curr.user.getMonthlyOwner()));
            }
            else {
                renderPaymentUI(curr.user.getManualyOwner(), getLocalMonth());
                totalToPayUI(false, curr.user.sumMine(curr.user.getManualyOwner()));
            }
            break;

        case 'view__all':
            if (filterElement.id === 'mon__filter') {
                renderPaymentUI(getMonthlyPayment(), getLocalMonth());
                totalToPayUI(true, sumList(getMonthlyPayment()));
            }
            else {
                renderPaymentUI(getManualyPayment(), getLocalMonth());
                totalToPayUI(false, sumList(getManualyPayment()));
            }

            break;
        case 'my__debts':
            if (filterElement.id === 'mon__filter') {
                renderPaymentUI(curr.user.getMonthlyDebts(), getLocalMonth());
                totalToPayUI(true, curr.user.sumDebts(curr.user.getMonthlyDebts()));
            }
            else {
                renderPaymentUI(curr.user.getManualyDebts(), getLocalMonth());
                totalToPayUI(false, curr.user.sumDebts(curr.user.getManualyDebts()));
            }
            break;
    }
}






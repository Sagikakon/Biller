import { DOM } from '../models/DOM';
import Expens from '../models/Expens';
import { curr, getID, incID, getLocalMonth } from '../script';
import { clearInputPayment, totalToPayUI, paymentUI, deleteItemUI, resetProgBar, getUser, formatNumber, toggleRecurringSubLabel } from '../views/expensView';
import { paymentResList, freshResList } from '../views/residentsView';
import { reMarkUserForPay } from '../views/userView';
import { getMonthlyPayment, getManualyPayment, sumList } from '../controllers/houseCtrl';
import { addPaymentFirebaseData, deleteFileFirebaseData, deletePaymentFirebaseData, setPaiedUsersFirebaseData } from '../controllers/dataBaseCtrl';
import { addBlurBackground } from '../views/houseView';
import { updateCurrUser } from './userCtrl';
import { deleteAllListUI, renderSpsifick } from '../views/listsView';
import { initUnpaidWarning } from '../views/dateView';

let usersForPay = [];


// Event listener  -- expens controller.
DOM.monthlyPayDOM.addEventListener('click', event => {
    deleteItemInit(event, true);
});

// Event listener  -- expens controller.
DOM.manualyPayDOM.addEventListener('click', event => {
    deleteItemInit(event, false);
});

// Event listener -- expens controller.
DOM.addPayDOM.addEventListener('click', () => { 
    DOM.addPayOutDOM.style.display = 'block';
    DOM.isMonthlyDOM.checked = false;
    addBlurBackground();
    DOM.isMonthlySubLabelDOM.textContent = '';
    DOM.assignListDOM.textContent = '';
    paymentResList();
    reMarkUserForPay();
    usersForPay = [];
});

// Event listener -- expens controller.
DOM.addPayOutDOM.addEventListener('click', el => {
    const expID = getID();

    if (el.target.id === "final-add") {
        const expType = DOM.isMonthlyDOM.checked;
        const payment = new Expens(
            expID, // exp id
            DOM.inputNameDOM.value, // exp name
            parseInt(DOM.inputTotalToPayDOM.value),// exp sum
            [], // user for pay
            getLocalMonth(), // exp month
            expType, // exp type -- true = month , false = manual
            false, // exp file - start with false.
            curr.user.userID, // ID of the owner.
            [] // allrady paied ID users.
        );

        const checkPayment = checkPaymentInput(payment);
        
        if (checkPayment === 'approve') {
            curr.house.paymentsListArr.push(payment);
            payment.updateUserArr(usersForPay);
            payment.setFileName();
            addPaymentFirebaseData(payment);
            totalToPayUI(expType, (expType ? sumList(getMonthlyPayment()) : sumList(getManualyPayment())));
            paymentUI(payment);
            incID();
            resetProgBar();
            freshResList();
            clearInputPayment();
        } else {
            rederPaymentErorUI(checkPayment)
        }
        
    }

    if (el.target.className.includes("assign-profile")) {
        toggleResidentsForPay(el);
    }

    if (el.target.id === "isMonthly") {
        toggleRecurringSubLabel(el);
    }
    
    if (el.target.id === 'cancel') {
        clearInputPayment();
        deleteFileFirebaseData();
        resetProgBar();
    }
});

DOM.wrapperDOM.addEventListener('click', el => {
    if (el.target.className.includes('did-pay')) {
        const payment = setPaymentInfo(el.target.closest(".item"))
        const confirmation = confirm(`Do you want to pay ${formatNumber(payment.paySum)} NIS to ${payment.ownerName} for ${payment.payName}?`)

        // ANSWER IS YES - UPDATE PAID USER
        if (confirmation) {
            makePaidArr(payment);
            curr.house.paymentsListArr[payment.index].paidUsers.push(curr.user.userID);
            setPaiedUsersFirebaseData(payment);
            updateCurrUser();
            deleteAllListUI();
            renderSpsifick();
            freshResList();
            initUnpaidWarning()
        }
    }
});

const makePaidArr = (payment) => {
    if (!curr.house.paymentsListArr[payment.index].paidUsers)
        curr.house.paymentsListArr[payment.index].paidUsers = [];
}

const rederPaymentErorUI = (checkPayment) => {
    switch (checkPayment) {

        case 'paymentName':
            alert('Payment name must have a value! \nPlease try again.')
            break;

        case 'paymentSum':
            alert('Payment sum must have a value! \nPlease try again.')
            break;
    }
}

const getPaymentInfo = ID => {
    let info = null;
    let index = null;

    curr.house.paymentsListArr.forEach((el, ind) => {
        if (el.id == ID) {
            info = el;
            index = ind;
        }
    })

    return {
        info,
        index
    }
}

const setPaymentInfo = item => {
    const payment = getPaymentInfo(getIntID(item.id));

    return {
        paySum: Math.round(payment.info.sum / (payment.info.userArr.length + 1)),
        payName: payment.info.name,
        ownerName: getUser(payment.info.owner).firstName,
        payID: payment.info.id,
        index: payment.index,
        paidUsers: payment.info.paidUsers
    }
}

// Need to add more cheks to function (valid name, valid sum) end also the function need to return false in case of eror.
const checkPaymentInput = payment => {
    if (!payment.name)
    return 'paymentName';
    if (!payment.sum)
        return 'paymentSum';  

    return 'approve'
}

const toggleResidentsForPay = (el) => {
    let index = 0;
    let includes = false;

    for (let i = 0; i < usersForPay.length; i++) {
        if (usersForPay[i] === el.target.id) {
            includes = true;
            index = i;
        }
    }

    if (!includes) {
        curr.house.userArr.forEach(element =>{
            if (element.userID === el.target.id) {
                usersForPay.push(element.userID);
            }
        });
    }
    else {
        usersForPay.splice(index, 1);
    }
}

// controller - interal function -- expens controller.
const deleteItemInit = (Event, type) => {
    let id;

    if (Event.target.closest('.item')) {
        id = Event.target.closest('.item').id;
    }

    if (Event.target.matches('.item__delete, .item__delete *')) {
        deleteItemUI(id);
        deleteFileFirebaseData(id);
        deleteItemData(id, curr.house.paymentsListArr);
        
        totalToPayUI(type, (type ? sumList(getMonthlyPayment()) : sumList(getManualyPayment())))
        freshResList();
    }
}

export const getDate = () => {
    let now = new Date();
    return now.getMonth()+1; 
}

//data function -- expenses data.
const deleteItemData = (id, list) => {
    const numID = getIntID(id);
    let index;
    list.forEach((el, ind) => {
        if (el.id === numID) {
            index = ind;
        }
    });
    curr.house.paymentsListArr.splice(index, 1);
    deletePaymentFirebaseData(numID);
}

// Internal function - used on item delete data only.
export const getIntID = strID => {
    return parseInt(strID.split('-')[1]);
}
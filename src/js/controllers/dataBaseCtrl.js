import firebase from '../firebase.js';
import { DOM } from "../models/DOM";
import { curr, getID } from "../script";
import { getIntID } from './expensCtrl.js';
import { getPayment } from './houseCtrl.js';
import { getUser } from '../views/expensView';

/*
   This page is responsible for the functions that operate the firebase.
   The functions are divided into 2 types: 
   1) Reading functions.
   2) Writing functions.
 */

/*GLOBAL VARIABLE */
const database = firebase.database();



/***********************************************************************************************************************
 ************************************************** Writing functions **************************************************
 ***********************************************************************************************************************/

/**
 * The setUserFirebaseDat() method get from the local current user information and write that info in the correct reference.
 */
export const setUserFirebaseData = () => {
    database.ref(`/households/userArr/${curr.user.userID}/firstName`).set(DOM.userFirstNameDOM.value);
    database.ref(`/households/userArr/${curr.user.userID}/lastName`).set(DOM.userLastNameDOM.value);
    database.ref(`/households/userArr/${curr.user.userID}/userName`).set(DOM.userNameDOM.value);
    database.ref(`/households/userArr/${curr.user.userID}/password`).set(DOM.userPasswordDOM.value);
    database.ref(`/households/userArr/${curr.user.userID}/image`).set(DOM.userProfileImageDOM.src);
}

/**
 * The setHouseFirebaseData() method get from the current DOM inputs data and write that info in the correct reference.
 */
export const setHouseFirebaseData = () => {
    database.ref('/households/address').set(DOM.houseAddressDOM.value);
    database.ref('/households/name').set(DOM.houseNameDOM.value);
    database.ref('/households/postal').set(parseInt(DOM.housePostalDOM.value));
}

/**
 * The addPaymentFirebaseData() method get from the recive parameter information and write that info in the correct reference.
 * also the method is async function because it's usually called with "await" method in front of it 
 */
export const addPaymentFirebaseData = async payment => {

    database.ref('/households/paymentsListArr/' + payment.id).set({
        id: payment.id,
        name: payment.name,
        sum: payment.sum,
        userArr: payment.userArr,
        month: payment.month,
        type: payment.type,
        file: payment.file,
        owner: payment.owner,
        paidUsers: payment.paidUsers
    });
}

/**
 * The deleteFileFirebaseData() method get from the recive parameter information and delete files in the correct reference.
 */
export const deleteFileFirebaseData = id => {
    if (DOM.fileUploadDOM.files[0]) {
        const fileName = DOM.fileUploadDOM.files[0].name
        firebase.storage().ref('files/').child(`${getID()}.${fileName}`).delete()
    }

    else if (id) {
        let payment = getPayment(getIntID(id));
        if (payment && payment.file) {
            firebase.storage().ref('files/').child(payment.file).delete()
        }
    }
}

/**
 * The setPaiedUsersFirebaseData() method get from the recive parameter information and write that info in the correct reference.
 * also the method is async function because it's usually called with "await" method in front of it 
 */
export const setPaiedUsersFirebaseData = async payment => {
    await database.ref(`/households/paymentsListArr/${payment.payID}/paidUsers`).set(payment.paidUsers);

}

/**
 * The setMonthAtFirebaseData() method get from the recive parameter information and write that info in the correct reference.
 * also the method is async function because it's usually called with "await" method in front of it 
 */
export const setMonthAtFirebaseData = async month => {
    await database.ref('Month').set(month);
}


/**
 * The setCurrentUserAtfirebaseData() method get from the recive parameter information and write that info in the correct reference.
 */
export const setCurrentUserAtfirebaseData = resID => {
    database.ref('/households/currentUser').set(resID);
}

/**
 * The setIdFirebaseData() method get from the recive parameter information and write that info in the correct reference.
 */
export const setIdFirebaseData = uniqIdCounter => {
    database.ref('ID').set(uniqIdCounter);
}

/**
 * The deletePaymentFirebaseData() method get from the recive parameter information and delete the payment in the correct reference.
 */
export const deletePaymentFirebaseData = id => {
    database.ref('/households/paymentsListArr/').child(id).remove();
}

/**
 * The resetMonthFirebase() method get from the interal Date obj the current month and write the month in the correct reference.
 */
export const resetMonthFirebase = async () => {
    const date = new Date;
    await database.ref('Month').set(date.getMonth() + 1);
}



/***********************************************************************************************************************
 ************************************************** Reading functions **************************************************
 ***********************************************************************************************************************/


/**
 * The getHouseholdFromFirebase() method read from the the correct reference and write it into the local house object.
 * also the method is async function because it's usually called with "await" method in front of it 
 */
export const getHouseholdFromFirebase = async () => {

    await database.ref('/households/').once('value', snapshot => {
        curr.house = snapshot.val();
        
        /*fixing the local house's payments array.
        really important for the program to work with a arrays.*/
        
        if (curr.house.paymentsListArr) {
            if (typeof (curr.house.paymentsListArr) === 'object')
                curr.house.paymentsListArr = Object.values(curr.house.paymentsListArr);
        }
        else {
            curr.house.paymentsListArr = [];
        }
    });
}

/**
 * The getUniqIdFromFirebase() method read from the the correct reference and return the correct ID.
 * also the method is async function because it's usually called with "await" method in front of it 
 */
export const getUniqIdFromFirebase = async () => {
    let uniqId;
    await database.ref('ID').once('value').then(function (snapshot) {
        uniqId = snapshot.val();
    });

    return uniqId
}

/**
 * The getMonthFromFirebase() method read from the the correct reference and return the month from the firebase (not always it is the current month.).
 * also the method is async function because it's usually called with "await" method in front of it 
 */
export const getMonthFromFirebase = async () => {
    let month;
    await database.ref('Month').once('value').then(function (snapshot) {
        month = snapshot.val();
    });

    return month
}

/**
 * The getCurrentUserFromFirebase() method read from the the correct reference and return update the local current user.
 * also the method is async function because it's usually called with "await" method in front of it 
 */
export const getCurrentUserFromFirebase = async () => {
    await database.ref('/households/currentUser').once('value').then(el => {
        curr.user = getUser(el.val());
    });
}



/**
 * This event listener operate uploude files into the database storage.
 * it's contain UI manipulations and reference function for the file himslef
 */
DOM.fileUploadDOM.addEventListener('change', () => {
    DOM.progBarDOM.style.display = "block"; // TOGGLE VIEW
    DOM.fileSuccessDOM.style.display = "none";

    const file = DOM.fileUploadDOM.files[0];
    const task = firebase.storage().ref(`files/${getID()}.${file.name}`).put(file);

    DOM.mainSiteSectionDOM.style.pointerEvents = "none";

    task.on('state_changed', function progress(snapshot) {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // multiply by 100 for the percentage illusion. 
        DOM.progBarDOM.value = percentage;
    },

        function error(err) {
            DOM.mainSiteSectionDOM.style.pointerEvents = "auto";
        },

        function complete() {
            DOM.progBarDOM.style.display = "none"; // TOGGLE VIEW
            DOM.fileSuccessDOM.style.display = "block";
            DOM.mainSiteSectionDOM.style.pointerEvents = "auto";
        });
});
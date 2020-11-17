import { DOM } from '../models/DOM';
import { curr } from '../script';
import firebase from '../firebase.js';
import { removeBlurBackground } from './houseView';

const FIRST_ELEMENT = 1;
const THIRD_ELEMENT = 3;


export const paymentUI = expens => {
    const mark =
        `
        <div class="item" id="item-${expens.id}">
            <div class="item-info">
                <p class="item-name">${expens.name}</p>
                <p class="item-price">${formatNumber(expens.sum)} NIS</p>
            </div>

            <div class="assign-list">
                
            </div>

            <div class="item__delete">
                <button class="${expens.type ? 'mon-item-delete-btn' : 'item-delete-btn'}">
                    <i class="fas fa-ban"></i>
                </button>
            </div>
        </div>
        `;

    expens.type ? DOM.monthlyPayDOM.insertAdjacentHTML('beforeend', mark) : DOM.manualyPayDOM.insertAdjacentHTML('beforeend', mark);


    if (expens.userArr) {
        expens.userArr.forEach(userID => {
            let mark =
                `
            <div class="profile-image">
                <img src=${getUser(userID).image} alt="" class="not__owner assign-profile" id=${getUser(userID).userName}>
                <span class="badge"></span>
            </div>
            `;

            if (expens.paidUsers) {
                expens.paidUsers.forEach(paidUsersID => {
                    if (getUser(paidUsersID).userName === getUser(userID).userName) {
                        mark =
                            `
                        <div class="profile-image">
                            <img src=${getUser(userID).image} alt="" class="not__owner assign-profile paid__user" id=${getUser(userID).userName}>
                            <span class="badge"></span>
                        </div>
                        `;
                    }
                });
            }

            document.getElementById(`item-${expens.id}`).children[FIRST_ELEMENT].insertAdjacentHTML('beforeend', mark);
        });
    }

    let markOwner =
        `
        <div class="profile-image owner">
            <img src=${getUser(expens.owner).image} alt="" class="owner__image assign-profile" id=${getUser(expens.owner).userName}>
            <span class="badge"></span>
        </div>
        `;
    document.getElementById(`item-${expens.id}`).insertAdjacentHTML('afterbegin', markOwner);

    if (!expens.paidUsers)
        expens.paidUsers = [];

    if (!expens.userArr)
        expens.userArr = [];

    const inAllUsers = expens.userArr.some(el => {
        return el == curr.user.userID;
    });

    const inPaidUsers = expens.paidUsers.some(el => {
        return el == curr.user.userID;
    });

    if (inAllUsers && !inPaidUsers) {

        let mark =
            `
            <button class="${expens.type ? 'mon-did-pay' : 'did-pay'} link">Pay Now</button>
            `;

        document.getElementById(`item-${expens.id}`).children[THIRD_ELEMENT].insertAdjacentHTML('beforebegin', mark);
    }

    if (expens.file) {
        firebase.storage().ref('files/').child(`${expens.file}`).getDownloadURL().then(URL => { // move to dataBaseCtrl
            const mark =
                `
                    <button class="item-info-btn" onclick="window.open('${URL}')">
                    <i class="fas fa-paperclip"></i>
                    </button>
                    `;

            document.getElementById(`item-${expens.id}`).children[THIRD_ELEMENT].insertAdjacentHTML('beforebegin', mark);
        });
    }
}

export const toggleRecurringSubLabel = el => {
    if (el.target.checked) {
        DOM.isMonthlySubLabelDOM.textContent = "please note, current payment will be auto renewed each month";
    }

    else
        DOM.isMonthlySubLabelDOM.textContent = "";
}

export const resetProgBar = () => {
    DOM.fileUploadDOM.value = "";
    DOM.progBarDOM.style.display = "block";
    DOM.progBarDOM.value = "0";
    DOM.fileSuccessDOM.style.display = "none";
}

export const clearInputPayment = () => {
    DOM.inputNameDOM.value = '';
    DOM.inputTotalToPayDOM.value = '';
    DOM.addPayOutDOM.style.display = 'none';
    removeBlurBackground();
};

// view function - used after changing payment's data -- expens view.
export const totalToPayUI = (type, sum) => {
    sum = formatNumber(Math.round(sum));
    type ? DOM.monthlySumDOM.textContent = ` ${sum} NIS Total` : DOM.manualySumDOM.textContent = ` ${sum} NIS Total`;
};

export const deleteItemUI = id => {
    const item = document.getElementById(id);
    if (item) item.parentElement.removeChild(item);
};

export const getUser = id => {
    let user = null
    curr.house.userArr.forEach(el => {
        if (el.userID === id) {
            user = el;
        }
    });

    return user;
}

export const formatNumber = intNum => {
    const numWithCommas = intNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return numWithCommas + ".00";
}
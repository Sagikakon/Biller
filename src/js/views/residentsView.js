import { DOM } from '../models/DOM';
import { curr } from '../script';
import { formatNumber } from './expensView';

export const residentsUI = () => {
    curr.house.userArr.forEach((el) => {
        let currUserMark;

        if (el === curr.user) {
            currUserMark =
            `
            <div class="image-and-crown">
                <img src=${el.image} alt="" class="profile">
                <i class="fas fa-crown"></i>
            </div>
            `
        }
        
        else {
            currUserMark =
            `
            <div class="image-and-crown">
                <img src=${el.image} alt="" class="profile">
            </div>
            `
        }

        const mark =
            `
            <div class="resident" id="${el.userID}">
                ${currUserMark}
                <div class="info">
                    <p class="name">${el.firstName + ' ' + el.lastName}</p>
                    <p class="status">${el.myDebts() ? `${formatNumber(el.myDebts())} NIS To Pay` : "Paid Fully"}</p>
                </div>
            </div>
            `;

        DOM.resListDOM.insertAdjacentHTML('beforeend', mark);
    });
};

// view function - use to init the photo resident in the resident list UI  -- resident view.
export const paymentResList = () => { // REMOVE OWNER
    curr.house.userArr.forEach((el) => {
        if (el.userID !== curr.user.userID) {
            const mark =
                `
           <img src=${el.image} alt="" class="assign-profile selector" id=${el.userID}>
           `;

            DOM.assignListDOM.insertAdjacentHTML('beforeend', mark);
        }
    });
};

export const getResFirstName = () => {
    let str = curr.house.userArr[0].firstName;

    for (let i = 1; i < curr.house.userArr.length; i++) {
        str = `${str}, ${curr.house.userArr[i].firstName}`;
    }

    return str;
}

export const deleteResList = () => {
    DOM.resListDOM.textContent = '';
}
export const freshResList = () => {
    deleteResList();
    residentsUI();
}

export const removeJiggle = () => {
    DOM.manageDOM.textContent = "Manage";

    document.querySelectorAll('.profile').forEach(el => {
        el.classList.remove('jiggle');
    });
}

export const toggleJiggle = () => {
    document.querySelectorAll('.profile').forEach(el => {
        if (curr.user.userID !== el.closest(".resident").id)
            el.classList.add('jiggle');
    })

    if (DOM.manageDOM.textContent === "Manage")
        DOM.manageDOM.textContent = "Cancel"

    else
        DOM.manageDOM.textContent = "Manage"
}
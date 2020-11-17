import { DOM } from '../models/DOM'
import { getMonthFromFirebase, setMonthAtFirebaseData } from '../controllers/dataBaseCtrl'
import { unpaidPayments } from '../controllers/dateCtrl';
import { getLocalMonth, setLocalMonth } from '../script';
import { deleteAllListUI, renderSpsifick } from './listsView';
import { freshResList } from './residentsView';




const listArray = Array.from(DOM.dateListDOM.children)

listArray.forEach((el, index) => {
    const width = el.getBoundingClientRect().width;
    el.style.left = index * width + "px";
})

const getMonthNumber = month => {
    const monthIndex = listArray.findIndex(el => {
        return month === el;
    })

    return monthIndex + 1;
}

export const moveToMonth = async (currentMonth, targetMonth) => {
    const amountToMove = targetMonth.style.left;

    DOM.dateListDOM.style.transform = `translateX(-${amountToMove})`
    currentMonth.classList.remove('date-current');
    targetMonth.classList.add('date-current');

    await setMonthAtFirebaseData(getMonthNumber(targetMonth));
    setLocalMonth(await getMonthFromFirebase());

    deleteAllListUI();
    freshResList();
    renderSpsifick();
}

export const renderDateUI = () => {
    /* CURRENT DATE UI - STARTING POINT */
    const amountToMove = (getLocalMonth() - 1) * (document.querySelector('.date-item').getBoundingClientRect().width);
    DOM.dateListDOM.style.transform = `translateX(-${amountToMove}px)`;
    DOM.dateListDOM.children[`${getLocalMonth() - 1}`].classList.add('date-current');
}

export const initUnpaidWarning = () => {
    if (unpaidPayments()) {
        document.querySelector('.prev-alert__container').style.backgroundColor = "var(--main-white)";
        DOM.unpaidPaymentsWarningDOM.style.display = "flex";
    }

    else {
        document.querySelector('.prev-alert__container').style.backgroundColor = "transparent";
        DOM.unpaidPaymentsWarningDOM.style.display = "none";
    }
}
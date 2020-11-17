import { DOM } from '../models/DOM';
import { curr, getID, getLocalMonth, incID } from '../script';
import { resetCheckBoxUI } from '../views/houseView';
import { deleteListUI, toggleFiltersUI } from '../views/listsView';
import { toggleListDelete, switchPaymentUI } from '../views/listsView';
import { removeJiggle } from '../views/residentsView';
import { addPaymentFirebaseData } from './dataBaseCtrl';
import { getMonthlyPayment } from './houseCtrl';

DOM.wrapperDOM.addEventListener('click', el => {
    let filterElement = toggleFiltersUI(el);
    if (filterElement) {
        deleteListUI(filterElement.id);
        switchPaymentUI(filterElement);
    }
}); 

DOM.monthlyEditDOM.addEventListener('click', () => {
    toggleListDelete(true)
});

DOM.manualyEditDOM.addEventListener('click', () => {
    toggleListDelete(false)
});


export const getFilterByMonthList = () => {
    let filteredList = curr.house.paymentsListArr.filter(el => {
        return el.month === getLocalMonth();
    });

    return filteredList;
}

export const copyMonthlyPayments = async () => {
    if (!(getMonthlyPayment().length)) {

        let filteredList = curr.house.paymentsListArr.map(a => ({ ...a }));

        filteredList = filteredList.filter(el => {
            return (el.month === (getLocalMonth() - 1) && el.type);
        });

        filteredList.forEach(el => {
            el.id = getID();
            incID();
            el.month = getLocalMonth();
            el.paidUsers = [];
        });
        for (let i = 0; i < filteredList.length; i++) {
            curr.house.paymentsListArr.push(filteredList[i]);
            await addPaymentFirebaseData(filteredList[i])
        }

    }
}
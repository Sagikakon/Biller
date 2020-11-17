import { curr } from "../script";
import { moveToMonth } from "../views/dateView";
import { DOM } from "../models/DOM";
import { getDate } from "./expensCtrl";

DOM.dateBackBtnDOM.addEventListener('click', () => {
    const currentMonth = document.querySelector('.date-current');
    let prevMonth = null;

    if (document.querySelector('.date-current').previousElementSibling)
        prevMonth = currentMonth.previousElementSibling;

    else
        prevMonth = DOM.dateListDOM.lastElementChild;

    moveToMonth(currentMonth, prevMonth);
})

DOM.dateforwardBtnDOM.addEventListener('click', () => {
    const currentMonth = document.querySelector('.date-current');
    let nextMonth = null;

    if (currentMonth.nextElementSibling)
        nextMonth = currentMonth.nextElementSibling;

    else
        nextMonth = DOM.dateListDOM.firstElementChild;

    moveToMonth(currentMonth, nextMonth)
});

export const unpaidPayments = () => {
    let result = false;
    const previousPayments = curr.house.paymentsListArr.filter(el => {
        return el.month < getDate();
    })

    previousPayments.forEach(el => {
        if (el.paidUsers) {
            if (el.paidUsers.length !== (el.userArr.length))
                result = true;
        }

        else if (el.userArr)
            result = true;
    });

    return result;
}
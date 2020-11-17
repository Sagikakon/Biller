import { DOM } from '../models/DOM';
import { curr } from '../script'
import { addBlurBackground, removeBlurBackground } from '../views/houseView';
import { renderAchievementsUI, updateCharts } from '../views/statsView';

const MIN_NUM = -9999;
const MAX_NUM =  9999999;

export const getStatData = () => {
    let charOwner = [];
    curr.house.userArr.forEach(el => {
        el.setAllOwnership();
        el.setAllPaiedPayments();
        el.setAllDebtsPayments();
        el.setAllFileUpload();
        el.setMonthDebtsPayments();
        charOwner.push({
            resName: `${el.firstName}`,
            numOwner: el.numOwner,
            sumOwner: el.sumOwner,
            sumAllPaiedPayments: el.sumAllPaiedPayments,
            sumAllDebtsPayments: el.sumAllDebtsPayments,
            sumMonthDebtsPayments: el.sumMonthDebtsPayments,
            sumAllFileUpload: el.sumAllFileUpload,
            image: el.image
        })
    });

    return charOwner;
}

export const getWinner = charOwner => {
    let winner = {
        mostOwner:{},
        mostPaiedRes:{},
        mostDebtsRes:{},
        mostCheapest:{},
        mostUploader:{}
        };
    winner.mostOwner.numOwner = MIN_NUM;
    winner.mostPaiedRes.sumAllPaiedPayments = MIN_NUM;
    winner.mostDebtsRes.sumAllDebtsPayments = MIN_NUM;
    winner.mostCheapest.sumAllPaiedPayments = MAX_NUM;
    winner.mostUploader.sumAllFileUpload = MIN_NUM;
    charOwner.forEach(el => {

        if(winner.mostOwner.numOwner < el.numOwner)
            winner.mostOwner = el;
        if(winner.mostPaiedRes.sumAllPaiedPayments < el.sumAllPaiedPayments)
            winner.mostPaiedRes = el;
        if(winner.mostCheapest.sumAllPaiedPayments > el.sumAllPaiedPayments)
            winner.mostCheapest = el;
        if(winner.mostDebtsRes.sumAllDebtsPayments < el.sumAllDebtsPayments)
            winner.mostDebtsRes = el;
        if(winner.mostUploader.sumAllFileUpload < el.sumAllFileUpload)
            winner.mostUploader = el;
    });
    return winner;
}

DOM.statsBtnDOM.addEventListener('click', () => {
    const winner = getWinner(getStatData());
    
    DOM.statsOutDOM.style.display = 'grid';
    addBlurBackground();
    renderAchievementsUI(winner);
    updateCharts(getStatData());
});

DOM.statsExitBtnDOM.addEventListener('click', () => {
    DOM.statsOutDOM.style.display = 'none';
    removeBlurBackground();
});
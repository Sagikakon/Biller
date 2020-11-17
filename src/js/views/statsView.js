import Chart from 'chart.js';
import { DOM } from '../models/DOM';
import { formatNumber } from './expensView';

Chart.defaults.global.defaultFontFamily = 'Segoe UI';

let myChartElement = DOM.ownershipBarChartDOM.getContext('2d');
let testChart = new Chart(myChartElement, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Total Paid',
            data: [
            ],

            backgroundColor: [
                '#794c74',
                '#c56183',
                '#b2deec'
            ]
        }],
    },

    options: {
        legend: {
            display: false
        },

        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0
                }
            }]
        }
    }
})

let myChartElement2 = DOM.monthlyDistributionChartDOM.getContext('2d');


let testChart2 = new Chart(myChartElement2, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: 'Total Paid',
            data: [
            ],

            backgroundColor: [
                '#794c74',
                '#c56183',
                '#b2deec'
            ]
        }],
    },

    options: {
        legend: {
            display: false
        },

        scales: {
            yAxes: [{
                display: false,
            }]
        }
    }
})

let myChartElement3 = DOM.alltimeDistributionChartDOM.getContext('2d');
let testChart3 = new Chart(myChartElement3, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            label: 'Total Paid',
            data: [
            ],

            backgroundColor: [
                '#794c74',
                '#c56183',
                '#b2deec'
            ]
        }],
    },

    options: {
        legend: {
            display: false
        },

        scales: {
            yAxes: [{
                display: false,
            }]
        }
    }
})

export const updateCharts = information => {
    let userNamesArray = [];
    let sumOwner = [];
    let allPaid = [];
    let monthlyPaid = [];

    information.forEach(el => {
        userNamesArray.push(el.resName)
        sumOwner.push(el.sumOwner)
        allPaid.push(el.sumAllPaiedPayments)
        monthlyPaid.push(el.sumMonthDebtsPayments)
    });

    testChart.data.labels = userNamesArray;
    testChart.data.datasets[0].data = sumOwner;
    testChart.update();

    testChart2.data.labels = userNamesArray;
    testChart2.data.datasets[0].data = allPaid;
    testChart2.update();

    testChart3.data.labels = userNamesArray;
    testChart3.data.datasets[0].data = monthlyPaid;
    testChart3.update();

}

export const renderAchievementsUI = (winner) => {
    DOM.mostOwnerDOM.textContent = `${winner.mostOwner.resName} has been the owner of ${winner.mostOwner.numOwner} expenses`;
    DOM.mostOwnerPicDOM.src = `${winner.mostOwner.image}`;

    DOM.mostMoneyDOM.textContent = `${winner.mostPaiedRes.resName} paid ${formatNumber(winner.mostPaiedRes.sumAllPaiedPayments)} NIS in total`;
    DOM.mostMoneyPicDOM.src = `${winner.mostPaiedRes.image}`;

    DOM.mostDebtDOM.textContent = `${winner.mostDebtsRes.resName} owed ${formatNumber(winner.mostDebtsRes.sumAllDebtsPayments)} NIS in total`;
    DOM.mostDebtPicDOM.src = winner.mostDebtsRes.image;

    DOM.mostCheapDOM.textContent = `${winner.mostCheapest.resName} has only paid ${formatNumber(winner.mostCheapest.sumAllPaiedPayments)} NIS`;
    DOM.mostCheapPicDOM.src = winner.mostCheapest.image;

    DOM.mostUploadDOM.textContent = `${winner.mostUploader.resName} uploaded a total of ${winner.mostUploader.sumAllFileUpload} files`;
    DOM.mostUploadPicDOM.src = winner.mostUploader.image;
}
import { getFilterByMonthList } from '../controllers/listsCtrl';
import { curr, getLocalMonth } from '../script';

export default class UserData {
    constructor(userID, userName, password, house, firstName, lastName, image, sumToPay) {
        this.userID = 0;
        this.userName = null;
        this.password = null;
        this.house = null;
        this.firstName = null;
        this.lastName = null;
        this.image = null;
        this.sumToPay = 0;
        this.sumOwner = 0;
        this.numOwner = 0;
        this.sumAllPaiedPayments = 0;
        this.sumAllDebtsPayments = 0;
        this.sumMonthDebtsPayments = 0;
        this.sumAllFileUpload = 0;

        if (userID) this.userID = userID;
        if (userName) this.userName = userName;
        if (password) this.password = password;
        if (house) this.house = house;
        if (firstName) this.firstName = firstName;
        if (lastName) this.lastName = lastName;
        if (image) this.image = image;
        if (sumToPay) this.sumToPay = sumToPay;
    }

    getMonthlyOwner() {
        let monthlyOwnerArr = [];  
        let filteredList = getFilterByMonthList(); 
        filteredList.forEach(el => {
            if (el.owner === this.userID && el.type)
                monthlyOwnerArr.push(el);
        });
        return monthlyOwnerArr;
    }

    getManualyOwner() {
        let manualyOwnerArr = [];
        let filteredList = getFilterByMonthList();
        filteredList.forEach(el => {
            if (el.owner === this.userID && !el.type)
                manualyOwnerArr.push(el);
        });
        return manualyOwnerArr;
    }

    getMonthlyDebts() { // GOOD LOGIC
        let monthlyDebtsArr = [];
        let filteredList = getFilterByMonthList();
        let flag = false;
       
        filteredList.forEach( el => {
            flag = false;
            if (el.owner !== this.userID && el.type) {
                if (el.userArr) {
                    for (let i = 0; i < el.userArr.length; i++) {
                        if (el.userArr[i] === this.userID) {
                            flag = true;
                        }
                    }
                }
                if(!flag) return;
                
                if (el.paidUsers) {
                    for (let i = 0; i < el.paidUsers.length; i++) {
                        if (el.paidUsers[i] === this.userID) {
                            flag = false;
                        }
                    }
                }
                if (flag) {
                    monthlyDebtsArr.push(el);
                }
            }
        });

        return monthlyDebtsArr;
    }

    getManualyDebts() {
        let manualyDebtsArr = [];
        let filteredList = getFilterByMonthList();
        let flag = false;
       
        filteredList.forEach( el => {
            flag = false;
            if (el.owner !== this.userID && !el.type) {
                if (el.userArr) {
                    for (let i = 0; i < el.userArr.length; i++) {
                        if (el.userArr[i] === this.userID) {
                            flag = true;
                        }
                    }
                }
                if(!flag) return;
                
                if (el.paidUsers) {
                    for (let i = 0; i < el.paidUsers.length; i++) {
                        if (el.paidUsers[i] === this.userID) {
                            flag = false;
                        }
                    }
                }
                if (flag) {
                    manualyDebtsArr.push(el);
                }
            }
        });

        return manualyDebtsArr;
    }

    sumMine(list) {
        let sumToPay = 0;
        list.forEach(el => {
            if(el.userArr)
                sumToPay += (el.sum / (el.userArr.length + 1)) * (el.userArr.length - el.paidUsers.length);
        });
        return sumToPay;
    }

    sumDebts(list) {
        let sumToPay = 0;
        list.forEach(el => {
            if(el.userArr)
                sumToPay += el.sum / (el.userArr.length + 1)
        });
        return sumToPay;
    }

    myDebts() {
        this.sumToPay = this.sumDebts(this.getMonthlyDebts()) + this.sumDebts(this.getManualyDebts());
        return Math.round(this.sumToPay);
    }


    setAllOwnership() {
        this.sumOwner = 0;
        this.numOwner = 0;

        curr.house.paymentsListArr.forEach(el => {
            if(el.owner === this.userID){
                this.sumOwner += (Math.round(el.sum/(el.userArr.length+1)))
                this.numOwner++
            }
        });
    }
    setAllPaiedPayments() {
        this.sumAllPaiedPayments = 0;
        curr.house.paymentsListArr.forEach(el => {
            if(el.owner === this.userID || this.isMine(el)){
                this.sumAllPaiedPayments += (Math.round(el.sum/(el.userArr.length+1)))
            }
        });
    }
    setAllFileUpload() {
        this.sumAllFileUpload = 0;
        curr.house.paymentsListArr.forEach(el => {
            if(el.owner === this.userID && el.file){
                this.sumAllFileUpload++
            }
        });
    }

    setAllDebtsPayments() {
        this.sumAllDebtsPayments = 0;
        curr.house.paymentsListArr.forEach(el => {
            if(this.isMine(el)){
                this.sumAllDebtsPayments += (Math.round(el.sum/(el.userArr.length+1)))
            }
        });
    }
    setMonthDebtsPayments() {
        this.sumMonthDebtsPayments = 0;
        curr.house.paymentsListArr.forEach(el => {
            if(( el.owner === this.userID || this.isMine(el)) && el.month === getLocalMonth()){
                this.sumMonthDebtsPayments += (Math.round(el.sum/(el.userArr.length+1)))
            }
        });
    }

    isMine (payment) {
        let flag = false;
        payment.userArr.forEach(el => {
            if(el === this.userID)
                flag = true;
        })
        return flag;
    }

}
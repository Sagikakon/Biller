import { DOM } from '../models/DOM';

export default class Expens {
    constructor(id, name, sum, userArr, month, type, file, owner, paidUsers) {
        this.id = null;
        this.name = null;
        this.sum = null;
        this.userArr = [];
        this.month = null;
        this.type = false;
        this.file = false;
        this.owner = null;
        this.paidUsers = [];

        if (id) this.id = id;
        if (name) this.name = name;
        if (sum) this.sum = sum;
        if (userArr) this.userArr = userArr;
        if (month) this.month = month;
        if (type) this.type = type;
        if (file) this.file = file;
        if (owner) this.owner = owner;
        if (paidUsers) this.paidUsers = paidUsers;
    }

    updateUserArr(array) {
        this.userArr = [...array];
    }

    setFileName() {
        if (DOM.fileUploadDOM.files[0]) {
            this.file =`${this.id}.${DOM.fileUploadDOM.files[0].name}`;
        }
    }
}
import * as firebase from 'firebase';

let config = {
    apiKey: "AIzaSyCzNYLH6NgxKU9QJ3IPeaxfu27HYva-pDQ",
    authDomain: "biller-2020.firebaseapp.com",
    databaseURL: "https://biller-2020.firebaseio.com",
    projectId: "biller-2020",
    storageBucket: "biller-2020.appspot.com",
    messagingSenderId: "85655883381",
    appId: "1:85655883381:web:cb382e02c10053324e323c"
};
firebase.initializeApp(config);

export default firebase;
import firebase from 'firebase';

var firebaseConfig = {
    // your firebase credentials here
    // apiKey: "<API_KEY_HERE>",
    // authDomain: "<API_KEY_HERE>",
    // databaseURL: "<API_KEY_HERE>",
    // projectId: "<API_KEY_HERE>",
    // storageBucket: "<API_KEY_HERE>",
    // messagingSenderId: "",
    // appId: "<>",
    // measurementId: ""
};
// Initialize Firebase
var Firebase = firebase.initializeApp(firebaseConfig);
export default Firebase;
// firebase.analytics();

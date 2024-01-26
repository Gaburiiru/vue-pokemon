import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
    apiKey: "AIzaSyAbPqQC8cf8uzZakx5ZIFptUUqr1vl0qss",
    authDomain: "vue-pokemon-24aab.firebaseapp.com",
    projectId: "vue-pokemon-24aab",
    storageBucket: "vue-pokemon-24aab.appspot.com",
    messagingSenderId: "79297568875",
    appId: "1:79297568875:web:b9302e246034828594d12e"
};

  // Initialize Firebase
firebase.initializeApp(config);
const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
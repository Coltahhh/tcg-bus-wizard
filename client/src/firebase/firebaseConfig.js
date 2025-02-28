// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbadT_JnHGA3PV-HljH4_MMG97rZr8FP8",
    authDomain: "tcg-bus-wizard.firebaseapp.com",
    projectId: "tcg-bus-wizard",
    storageBucket: "tcg-bus-wizard.firebasestorage.app",
    messagingSenderId: "955883115244",
    appId: "1:955883115244:web:485e9640ffbf0da2078bc9",
    measurementId: "G-21GBTLZLBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
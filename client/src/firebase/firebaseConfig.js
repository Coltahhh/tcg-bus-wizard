// client/src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAbadT_JnHGA3PV-HljH4_MMG97rZr8FP8",
    authDomain: "tcg-bus-wizard.firebaseapp.com",
    databaseURL: "https://tcg-bus-wizard-default-rtdb.firebaseio.com",
    projectId: "tcg-bus-wizard",
    storageBucket: "tcg-bus-wizard.firebasestorage.app",
    messagingSenderId: "955883115244",
    appId: "1:955883115244:web:485e9640ffbf0da2078bc9",
    measurementId: "G-21GBTLZLBX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
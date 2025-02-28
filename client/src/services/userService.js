// client/src/services/userService.js
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const createUserProfile = async (userId, data) => {
    await setDoc(doc(db, "users", userId), {
        ...data,
        createdAt: new Date().toISOString()
    });
};

export const getUserProfile = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (userId, updates) => {
    await updateDoc(doc(db, "users", userId), updates);
};
// client/src/services/userService.js
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const createUserProfile = async (userId, data) => {
    await setDoc(doc(db, 'users', userId), {
        ...data,
        createdAt: new Date().toISOString(),
    });
};
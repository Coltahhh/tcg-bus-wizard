import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
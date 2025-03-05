import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
    const { username } = req.query;

    const q = query(collection(db, 'users'), where('username', '==', username));
    const snapshot = await getDocs(q);

    res.status(200).json({ exists: !snapshot.empty });
}
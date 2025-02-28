// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { initializeFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Initialize Firestore
const db = initializeFirestore(admin.app());

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Authentication Middleware
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// User Routes
app.post('/users', authenticate, async (req, res) => {
    try {
        const { uid, email, displayName } = req.user;
        const userRef = db.collection('users').doc(uid);

        await userRef.set({
            email,
            displayName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ...req.body
        });

        res.status(201).json({ message: 'User profile created' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/me', authenticate, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userDoc.data());
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Tournament Routes
app.post('/tournaments', authenticate, async (req, res) => {
    try {
        const tournamentRef = db.collection('tournaments').doc();

        await tournamentRef.set({
            ...req.body,
            organizer: req.user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            participants: []
        });

        res.status(201).json({ id: tournamentRef.id });
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Firebase connected to project: ${serviceAccount.project_id}`);
});
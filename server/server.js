require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { initializeFirestore } = require('firebase-admin/firestore');

// Initialize Express
const app = express();

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

// Initialize Firestore
const db = initializeFirestore(admin.app());

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        firebase: serviceAccount.project_id
    });
});

// Example Tournament Routes
const tournamentsRouter = express.Router();

tournamentsRouter.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('tournaments').get();
        const tournaments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

tournamentsRouter.post('/', async (req, res) => {
    try {
        const newTournament = {
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('tournaments').add(newTournament);
        res.status(201).json({ id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mount Routes
app.use('/api/tournaments', tournamentsRouter);

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Server Configuration
const PORT = process.env.PORT || 3001;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    console.log(`
  Server running in ${ENVIRONMENT} mode
  Listening on port ${PORT}
  Firebase project: ${serviceAccount.project_id}
  CORS allowed origin: ${process.env.CLIENT_URL || 'http://localhost:3000'}
  `);
});
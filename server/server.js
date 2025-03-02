require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { initializeFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const serviceAccount = {
    type: "service_account",
    project_id: "tcg-bus-wizard",
    private_key_id: "4b7add9508717e156ccda8196c1cbf247a74b934",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCnwtspP56L2DOw\nPM1xsyDXk31Tetp3JS9kNeS2pyUknprJUk+GwMg4Ys780uIpOjg5cupSnIoP13Lx\n21UgrNui0bLXPVpf/PzgBAIlUAxyRgSPF6jxBRKwBb352tU49fEmJBboTVk9TcWD\nOKJurx+hobMY0i3fGHE+AjWPTXxyrZuaWS47SYgwM7PuvlmEu2LhEC3h/z9CJp7W\npWZ1dOhKWlIXadyDccLw09oMXyEGUfE6T6PBulJHkHekMbtt0Sji9RucKT/jGbS1\nWxmx2pwS8efGVygniml0l/8zXU6C/h8ohC5wBNCcsCu31kVEsUaVcQNfGX3TspWL\nx95fZ6RjAgMBAAECggEAG3XOWPykb6CmqVDykgtvs0ndqFYCP6FzFfSqaOmIL2vU\ny2JxSQ3yWCR4XDMKuRPiEylHyNj90mUCWCt+TjhtRUQNAaV1zyOCowqU7VWii+wB\nIAkP6s/ZRL3T4HudDlNXs1YR99l9Y4cA7x9Mm1CIHXVx8vyobI28L5m9+aSF2+Fh\n6djDY/t+d8i/AEPY8G15L/hQcjBVsprKII+I1Oo0ZXk575+AY+ZruIKxSGgRwdW9\nsCU4KT76f8K8WfgtsTkReL48jP+zkTV6r0mobn7gYrRxH4VtrGoLJx5UG4RG+3CI\nwjoaDJR9kB6t/1/5asC7sKE8tXzqmQwU0pIRnJhETQKBgQDixbKabMkPh9JfYjZp\nqiLaOw6/tGKCQH98V/6/vgRiMGkBcknIhtBoSndSb4qSfcKLjxljWJLpwPXEdmXR\n9jOEWYpqYrZAW62gopMIXOWyvBQVA+wsb9xTOHnDqCRt5pW/klazYGYF5O0kZP+y\nJY5sqMYAek+uv3hpZM193F+LbQKBgQC9YhmJOqTUQ72zXCaLITYRjphV9MwrpyMs\nfD+xaKbqBvS6zqNXVUb6hxcB11YP8A7Ub5D5j0Xvsnj0JLo/s6m/vwKXR1sYzZGq\npfEn9o5AduhsRtx/y8e6HcaNHUWh9oqQzLjQwH+iVmQtwU4K12XNhL4SCrqbBVHo\ngaO8GPu9DwKBgDeNxQZNtifG10OktL3H/0fFBgTytNtB37lfeToR29MOFvtSuz6T\nwER8UaTxTFo80scLpGWRElSPf+XEN4drMA2xPdZ4Hju/+dYLXcfDskXKC4Vmc5oj\nQS9l+3ZyH5KI1ZCb0f+ZkwTIo0uyLm2/A5gc9HyzegfOQjpXhnvZ29I1AoGAHEdb\nvMwO9MswtmmaL8hDxJdgU+V730DT1b6v3BPeaK+lN4fHiDDpqlslqla3OSYFcN8/\n7KPiM4qY2Qvq67wuKr2g62nyRl/b0nl46xi74RBgYFqsbkDFkBsGHOg0D506z6hi\nKHm2FU2FI/fraV8Eio25vAPyHVfMBUXmZx3r6S0CgYABd1u5a6szCuPkwnD76PZz\n1ZxwRO/ZE/YIV+SZx2kkh+RJHDXOKy/+hEVkmy+O3GQpOVgYR7+ZwicERUKca06U\nW5Wj9l/tjX6zpuBf3V1qXq8rkMHsrJP7nOR16aaxOv6rcYTJ/KfIYi8L8XyNaRu0\npwKbi7nYYhJAbAXDcn/JWw==\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@tcg-bus-wizard.iam.gserviceaccount.com",
    client_id: "116671003595803542780",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40tcg-bus-wizard.iam.gserviceaccount.com",

};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
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
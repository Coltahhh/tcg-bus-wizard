// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'TCGBusWizard API',
        documentation: {
            healthCheck: '/api/health',
            tournaments: '/api/tournaments',
            users: '/api/users'
        }
    });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Other Routes
const tournamentsRouter = require('./routes/tournaments');
app.use('/api/tournaments', tournamentsRouter);

// Handle 404 - Keep this AFTER all other routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
        validEndpoints: ['/', '/api/health', '/api/tournaments']
    });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
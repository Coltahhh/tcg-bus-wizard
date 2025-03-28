import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import url from 'url';
import winston from 'winston';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';

// Configuration
dotenv.config();
const app = express();
const server = http.createServer(app);

// Logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// Database connection
connectDB();

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    const { query } = url.parse(req.url, true);
    ws.tournamentId = query.tournamentId;

    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client.tournamentId === ws.tournamentId && client !== ws) {
                client.send(message.toString());
            }
        });
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/rankings', rankingRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        dbState: mongoose.connection.readyState,
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message}`);
    res.status(err.status || 500).json({
        error: {
            message: process.env.NODE_ENV === 'production'
                ? 'Server error'
                : err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
});

// Server initialization
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        });
    });
});
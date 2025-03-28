import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Error messages
const authError = (message) => ({
    status: 401,
    title: 'Authentication Error',
    message
});

const forbiddenError = {
    status: 403,
    title: 'Forbidden',
    message: 'You do not have permission to perform this action'
};

// Verify JWT token
const verifyToken = asyncHandler(async (req, res, next) => {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies
    else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json(authError('Not authenticated'));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Get fresh user from DB
        const currentUser = await User.findById(decoded.userId).select('+passwordChangedAt');

        if (!currentUser) {
            return res.status(401).json(authError('User no longer exists'));
        }

        // Check if user changed password after token was issued
        if (currentUser.passwordChangedAfter(decoded.iat)) {
            return res.status(401).json(authError('Password changed! Please log in again'));
        }

        // Attach user to request
        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(authError('Token expired'));
        }
        return res.status(401).json(authError('Invalid token'));
    }
});

// Role-based authorization
const checkRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json(forbiddenError);
    }
    next();
};

// Optional authentication
const optionalAuth = asyncHandler(async (req, res, next) => {
    if (req.cookies?.accessToken) {
        try {
            const decoded = jwt.verify(
                req.cookies.accessToken,
                process.env.JWT_ACCESS_SECRET
            );

            const currentUser = await User.findById(decoded.userId);
            if (currentUser) req.user = currentUser;
        } catch (error) {
            // Ignore invalid/expired tokens for optional auth
        }
    }
    next();
});

// Session verification for sensitive operations
const verifySession = asyncHandler(async (req, res, next) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            status: 400,
            title: 'Validation Error',
            message: 'Password is required for this operation'
        });
    }

    if (!(await req.user.comparePassword(password))) {
        return res.status(401).json(authError('Incorrect password'));
    }

    next();
});

// CSRF protection for state-changing operations
const csrfProtection = (req, res, next) => {
    if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
        return res.status(403).json({
            status: 403,
            title: 'Forbidden',
            message: 'CSRF protection triggered'
        });
    }
    next();
};

export default {
    verifyToken,
    checkRole,
    optionalAuth,
    verifySession,
    csrfProtection,
    roles: {
        admin: checkRole('admin'),
        organizer: checkRole('organizer', 'admin'),
        user: checkRole('user', 'organizer', 'admin')
    }
};
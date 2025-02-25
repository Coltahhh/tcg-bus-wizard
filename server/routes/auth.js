const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/signup', async (req, res) => {
    try {
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const user = new User({
            ...req.body,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: Date.now() + 3600000
        });

        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Verify Your Email',
            html: `Click <a href="${verificationUrl}">here</a> to verify your email.`
        });

        res.status(201).json({ message: 'Verification email sent' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add login, verify-email, and other auth routes
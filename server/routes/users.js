const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('joinedTournaments')
            .select('-password');
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

// Update profile (protected route)
router.patch('/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: req.body },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
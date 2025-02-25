const express = require('express');
const router = express.Router();
const Ranking = require('../models/Ranking');

// Get all rankings
router.get('/', async (req, res) => {
    try {
        const rankings = await Ranking.find().sort({ points: -1 });
        res.json(rankings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
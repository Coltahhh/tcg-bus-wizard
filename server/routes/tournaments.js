const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');

// Get all tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.json(tournaments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create tournament
router.post('/', async (req, res) => {
    const tournament = new Tournament({
        name: req.body.name,
        date: req.body.date,
        participants: req.body.participants,
        bracket: req.body.bracket
    });

    try {
        const newTournament = await tournament.save();
        res.status(201).json(newTournament);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
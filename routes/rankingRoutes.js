const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Tournament = require('../models/Tournament');
const User = require('../models/User');

// @route   GET api/tournaments
// @desc    Get all tournaments
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const tournaments = await Tournament.find(filter)
            .populate('organizer', 'username')
            .populate('participants', 'username')
            .sort({ date: -1 });

        res.json(tournaments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tournaments
// @desc    Create new tournament
router.post(
    '/',
    [
        auth,
        [
            check('name', 'Tournament name is required').not().isEmpty(),
            check('date', 'Valid date is required').isISO8601(),
            check('participants', 'Participants must be an array').optional().isArray()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, date, participants = [] } = req.body;

            // Verify participants exist
            const validParticipants = await User.find({
                _id: { $in: participants }
            }).select('_id');

            const tournament = new Tournament({
                name,
                date,
                organizer: req.user.id,
                participants: validParticipants.map(p => p._id),
                bracket: Tournament.createBracket(validParticipants)
            });

            await tournament.save();
            res.json(tournament);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/tournaments/:id
// @desc    Get tournament by ID
router.get('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
            .populate('organizer', 'username')
            .populate('participants', 'username')
            .populate('bracket.rounds.matches.players', 'username');

        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        res.json(tournament);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tournaments/:id
// @desc    Update tournament
router.put('/:id', auth, async (req, res) => {
    try {
        let tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        // Check if user is organizer
        if (tournament.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'date', 'status', 'prizeStructure'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ msg: 'Invalid updates' });
        }

        updates.forEach(update => tournament[update] = req.body[update]);
        await tournament.save();
        res.json(tournament);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tournaments/:id/participants
// @desc    Add participant to tournament
router.post('/:id/participants', auth, async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        const user = await User.findById(req.body.userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (tournament.participants.includes(user._id)) {
            return res.status(400).json({ msg: 'User already participating' });
        }

        tournament.participants.push(user._id);
        await tournament.save();
        res.json(tournament.participants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tournaments/:id/bracket
// @desc    Update match result
router.post('/:id/bracket', auth, async (req, res) => {
    try {
        const { roundIndex, matchId, winnerId } = req.body;
        const tournament = await Tournament.findById(req.params.id);

        // Check if user is organizer
        if (tournament.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const round = tournament.bracket.rounds[roundIndex];
        const match = round.matches.get(matchId);

        if (!match) {
            return res.status(404).json({ msg: 'Match not found' });
        }

        match.winner = winnerId;
        match.status = 'completed';

        // Update next round matches if needed
        if (round.roundType !== 'final' && match.children.length > 0) {
            // Logic to propagate winner to next round
        }

        await tournament.save();
        res.json(tournament.bracket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
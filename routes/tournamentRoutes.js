import express from 'express';
import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Tournament from '../models/Tournament.js';
import User from '../models/User.js';

const router = express.Router();

// Validation error handler middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @route   POST /api/tournaments
// @desc    Create new tournament
router.post(
    '/',
    auth,
    [
        check('name', 'Tournament name is required').not().isEmpty(),
        check('format', 'Invalid tournament format').isIn([
            'single_elimination',
            'double_elimination',
            'swiss',
            'round_robin'
        ]),
        check('maxParticipants', 'Max participants must be between 2 and 128')
            .isInt({ min: 2, max: 128 }),
        check('startDate', 'Valid start date required').isISO8601()
    ],
    validate,
    asyncHandler(async (req, res) => {
        const { name, format, maxParticipants, startDate, location, description } = req.body;

        const tournament = new Tournament({
            name,
            format,
            maxParticipants,
            startDate,
            location,
            description,
            organizer: req.user.id
        });

        await tournament.save();
        res.status(201).json(tournament);
    })
);

// @route   GET /api/tournaments
// @desc    Get all tournaments
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { page = 1, limit = 10, status, format } = req.query;
        const query = {};

        if (status) query.status = status;
        if (format) query.format = format;

        const tournaments = await Tournament.find(query)
            .populate('organizer', 'username avatar')
            .populate('participants', 'username avatar')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort('-createdAt');

        const count = await Tournament.countDocuments(query);

        res.json({
            tournaments,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    })
);

// @route   GET /api/tournaments/:id
// @desc    Get tournament by ID
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const tournament = await Tournament.findById(req.params.id)
            .populate('organizer', 'username avatar')
            .populate('participants', 'username avatar')
            .populate('rounds.matches.players', 'username avatar');

        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        res.json(tournament);
    })
);

// @route   PUT /api/tournaments/:id
// @desc    Update tournament details
router.put(
    '/:id',
    auth,
    [
        check('status', 'Invalid status').optional().isIn([
            'scheduled',
            'registration_open',
            'in_progress',
            'completed',
            'canceled'
        ])
    ],
    validate,
    asyncHandler(async (req, res) => {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        if (tournament.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'name',
            'description',
            'status',
            'location',
            'prizePool',
            'rules',
            'maxParticipants'
        ];

        updates.forEach(update => {
            if (allowedUpdates.includes(update)) {
                tournament[update] = req.body[update];
            }
        });

        await tournament.save();
        res.json(tournament);
    })
);

// @route   DELETE /api/tournaments/:id
// @desc    Delete tournament
router.delete(
    '/:id',
    auth,
    asyncHandler(async (req, res) => {
        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        if (tournament.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        await tournament.deleteOne();
        res.json({ msg: 'Tournament removed' });
    })
);

// @route   POST /api/tournaments/:id/participants
// @desc    Add/remove participants
router.post(
    '/:id/participants',
    auth,
    [
        check('action', 'Invalid action').isIn(['join', 'leave', 'add', 'remove']),
        check('userId', 'User ID required for add/remove')
            .if(req => ['add', 'remove'].includes(req.body.action)
                .isMongoId())
    ],
    validate,
    asyncHandler(async (req, res) => {
        const tournament = await Tournament.findById(req.params.id);
        const { action, userId } = req.body;

        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        switch (action) {
            case 'join':
                if (tournament.participants.includes(req.user.id)) {
                    return res.status(400).json({ msg: 'Already registered' });
                }
                tournament.participants.push(req.user.id);
                break;

            case 'leave':
                tournament.participants = tournament.participants.filter(
                    p => p.toString() !== req.user.id
                );
                break;

            case 'add':
                if (tournament.organizer.toString() !== req.user.id) {
                    return res.status(403).json({ msg: 'Not authorized' });
                }
                tournament.participants.push(userId);
                break;

            case 'remove':
                if (tournament.organizer.toString() !== req.user.id) {
                    return res.status(403).json({ msg: 'Not authorized' });
                }
                tournament.participants = tournament.participants.filter(
                    p => p.toString() !== userId
                );
                break;
        }

        await tournament.save();
        res.json(tournament.participants);
    })
);

// @route   POST /api/tournaments/:id/generate-bracket
// @desc    Generate tournament bracket
router.post(
    '/:id/generate-bracket',
    auth,
    asyncHandler(async (req, res) => {
        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        if (tournament.organizer.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        tournament.rounds = tournament.generateBracket();
        tournament.status = 'in_progress';
        await tournament.save();

        res.json(tournament.rounds);
    })
);

// @route   PUT /api/tournaments/:id/matches/:matchId
// @desc    Update match result
router.put(
    '/:id/matches/:matchId',
    auth,
    check('winner', 'Winner ID is required').isMongoId(),
    validate,
    asyncHandler(async (req, res) => {
        const tournament = await Tournament.findById(req.params.id);
        const { winner } = req.body;

        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        if (tournament.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const match = tournament.rounds
            .flatMap(round => round.matches)
            .find(m => m._id === req.params.matchId);

        if (!match) {
            return res.status(404).json({ msg: 'Match not found' });
        }

        match.winner = winner;
        match.status = 'completed';
        match.endTime = new Date();

        if (match.nextMatch) {
            const nextMatch = tournament.rounds
                .flatMap(round => round.matches)
                .find(m => m._id === match.nextMatch);

            if (nextMatch) {
                nextMatch.players.push(winner);
                if (nextMatch.players.length === 2) {
                    nextMatch.status = 'in_progress';
                    nextMatch.startTime = new Date();
                }
            }
        }

        await tournament.save();
        res.json(tournament);
    })
);

export default router;
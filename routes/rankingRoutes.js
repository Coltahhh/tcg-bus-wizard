import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import Ranking from '../models/Ranking.js';
import User from '../models/User.js';
import Tournament from '../models/Tournament.js';
import redisClient from '../config/redis.js';

const router = express.Router();

// Cache middleware
const cache = (duration) => async (req, res, next) => {
    const key = `ranking:${req.originalUrl}`;
    const cachedData = await redisClient.get(key);

    if (cachedData) {
        return res.json(JSON.parse(cachedData));
    }

    res.originalSend = res.json;
    res.json = (body) => {
        redisClient.setEx(key, duration, JSON.stringify(body));
        res.originalSend(body);
    };
    next();
};

// @route   GET /api/rankings/leaderboard
// @desc    Get paginated leaderboard
router.get('/leaderboard', cache(300), async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { totalPoints: -1 },
            populate: {
                path: 'user',
                select: 'username avatar profile'
            }
        };

        const rankings = await Ranking.paginate({}, options);

        res.json({
            rankings: rankings.docs,
            totalPages: rankings.totalPages,
            currentPage: rankings.page
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/rankings/user/:userId
// @desc    Get user ranking details
router.get('/user/:userId', cache(180), async (req, res) => {
    try {
        const ranking = await Ranking.findOne({ user: req.params.userId })
            .populate({
                path: 'tournamentPoints.tournament',
                select: 'name date location'
            })
            .populate('user', 'username avatar');

        if (!ranking) {
            return res.status(404).json({ msg: 'Ranking not found' });
        }

        // Calculate recent performance
        const recentResults = ranking.recentResults.slice(-10);
        const winRate = recentResults.filter(r => r === 'win').length / 10 * 100;

        res.json({
            ...ranking.toObject(),
            recentPerformance: {
                winRate,
                wins: recentResults.filter(r => r === 'win').length,
                losses: recentResults.filter(r => r === 'loss').length
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/rankings/update
// @desc    Update rankings after tournament (Admin only)
router.post('/update', [
    auth,
    admin,
    check('tournamentId', 'Tournament ID is required').isMongoId(),
    check('results', 'Results array is required').isArray()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const session = await Ranking.startSession();
    session.startTransaction();

    try {
        const { tournamentId, results } = req.body;
        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found' });
        }

        for (const result of results) {
            const { userId, points, placement } = result;

            // Update ranking
            await Ranking.findOneAndUpdate(
                { user: userId },
                {
                    $inc: {
                        totalPoints: points,
                        tournamentsPlayed: 1,
                        wins: placement === 1 ? 1 : 0,
                        losses: placement > 4 ? 1 : 0
                    },
                    $push: {
                        tournamentPoints: {
                            tournament: tournamentId,
                            points,
                            placement
                        },
                        recentResults: {
                            $each: [placement <= 4 ? 'win' : 'loss'],
                            $slice: -10
                        },
                        rankingHistory: {
                            date: new Date(),
                            points: totalPoints + points,
                            rank: 0 // Will be recalculated
                        }
                    }
                },
                { session, new: true }
            );
        }

        // Recalculate global rankings
        const allRankings = await Ranking.find().sort({ totalPoints: -1 }).session(session);
        await Promise.all(allRankings.map(async (ranking, index) => {
            ranking.currentRank = index + 1;
            await ranking.save({ session });
        }));

        await session.commitTransaction();
        res.json({ msg: 'Rankings updated successfully' });

    } catch (err) {
        await session.abortTransaction();
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        session.endSession();
        redisClient.flushDb(); // Clear cache after update
    }
});

// @route   GET /api/rankings/history/:userId
// @desc    Get ranking history with filters
router.get('/history/:userId', async (req, res) => {
    try {
        const { from, to, interval = 'weekly' } = req.query;
        const matchStage = { user: req.params.userId };

        if (from && to) {
            matchStage['rankingHistory.date'] = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }

        const aggregation = [
            { $match: matchStage },
            { $unwind: '$rankingHistory' },
            { $sort: { 'rankingHistory.date': -1 } },
            { $group: {
                    _id: {
                        $dateTrunc: {
                            date: '$rankingHistory.date',
                            unit: interval === 'daily' ? 'day' : 'week'
                        }
                    },
                    averagePoints: { $avg: '$rankingHistory.points' },
                    averageRank: { $avg: '$rankingHistory.rank' }
                }},
            { $project: {
                    date: '$_id',
                    averagePoints: 1,
                    averageRank: 1,
                    _id: 0
                }},
            { $sort: { date: 1 } }
        ];

        const history = await Ranking.aggregate(aggregation);
        res.json(history);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/rankings/history
// @desc    Clear ranking history (Admin only)
router.delete('/history', [auth, admin], async (req, res) => {
    try {
        await Ranking.updateMany(
            {},
            { $set: { rankingHistory: [] } }
        );

        redisClient.flushDb();
        res.json({ msg: 'Ranking history cleared' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
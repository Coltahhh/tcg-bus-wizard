const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Ranking = require('../models/Ranking');

// @route   GET api/rankings
// @desc    Get leaderboard
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const rankings = await Ranking.find()
            .populate('user', 'username avatar')
            .sort({ totalPoints: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Ranking.countDocuments();

        res.json({
            rankings,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/rankings/:userId
// @desc    Get user ranking
router.get('/:userId', async (req, res) => {
    try {
        const ranking = await Ranking.findOne({ user: req.params.userId })
            .populate({
                path: 'tournamentPoints.tournament',
                select: 'name date'
            });

        if (!ranking) {
            return res.status(404).json({ msg: 'Ranking not found' });
        }

        res.json(ranking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/rankings/update
// @desc    Update rankings after tournament (Admin only)
router.post('/update', [auth, admin], async (req, res) => {
    try {
        const { tournamentId, results } = req.body;
        const processedResults = results.map(result => ({
            userId: result.userId,
            points: result.points,
            placement: result.placement
        }));

        await Ranking.updateTournamentResults(tournamentId, processedResults);

        res.json({ msg: 'Rankings updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/rankings/history/:userId
// @desc    Get ranking history for user
router.get('/history/:userId', async (req, res) => {
    try {
        const { from, to, limit = 10 } = req.query;
        const filter = { user: req.params.userId };

        if (from && to) {
            filter['rankingHistory.date'] = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }

        const history = await Ranking.aggregate([
            { $match: filter },
            { $unwind: '$rankingHistory' },
            { $sort: { 'rankingHistory.date': -1 } },
            { $limit: parseInt(limit) },
            { $project: {
                    date: '$rankingHistory.date',
                    points: '$rankingHistory.points',
                    rank: '$rankingHistory.rank'
                }}
        ]);

        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/rankings/history
// @desc    Clear ranking history (Admin only)
router.delete('/history', [auth, admin], async (req, res) => {
    try {
        await Ranking.updateMany(
            {},
            { $set: { rankingHistory: [] } }
        );

        res.json({ msg: 'Ranking history cleared' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
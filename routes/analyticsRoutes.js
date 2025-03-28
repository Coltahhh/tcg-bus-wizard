// routes/analyticsRoutes.js
router.get('/tournaments/:id/stats', async (req, res) => {
    const stats = await Tournament.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        { $unwind: '$bracket.rounds' },
        // ... complex aggregation pipeline
    ]);
    res.json(stats);
});
const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
    wins: { type: Number, default: 0 }
});

module.exports = mongoose.model('Ranking', rankingSchema);
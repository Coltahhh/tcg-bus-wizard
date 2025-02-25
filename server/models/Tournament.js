const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bracket: { type: Object, default: {} }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
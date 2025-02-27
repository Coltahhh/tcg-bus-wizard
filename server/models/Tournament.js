// models/Tournament.js
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    bracket: {
        rounds: [{
            roundName: String,
            matches: [{
                player1: String,
                player2: String,
                winner: String
            }]
        }]
    }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
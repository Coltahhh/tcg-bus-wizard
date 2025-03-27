const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    matchId: { type: String, required: true }, // e.g., "quarterfinal1"
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    children: [{ type: String }], // References to previous matches
    score: [{
        player: { type: Schema.Types.ObjectId, ref: 'User' },
        points: Number
    }],
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    }
});

const RoundSchema = new Schema({
    roundType: {
        type: String,
        enum: ['quarterfinal', 'semifinal', 'final'],
        required: true
    },
    matches: {
        type: Map,
        of: MatchSchema
    }
});

const TournamentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: String,
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    participantCount: {
        type: Number,
        default: 0
    },
    bracket: {
        rounds: [RoundSchema]
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    prizeStructure: {
        firstPlace: String,
        secondPlace: String,
        thirdFourthPlace: String
    }
}, { timestamps: true });

// Pre-save hook to update participant count
TournamentSchema.pre('save', function(next) {
    this.participantCount = this.participants.length;
    next();
});

// Static method for creating a new tournament bracket
TournamentSchema.statics.createBracket = function(participants) {
    // Implement your bracket generation logic here
    // This is a basic example for 8 participants
    const bracket = {
        rounds: [
            {
                roundType: 'quarterfinal',
                matches: {
                    quarterfinal1: {
                        players: participants.slice(0, 2),
                        children: []
                    },
                    // ... other quarterfinal matches
                }
            },
            // ... other rounds
        ]
    };
    return bracket;
};

module.exports = mongoose.model('Tournament', TournamentSchema);
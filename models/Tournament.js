import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const matchSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    round: {
        type: Number,
        required: true
    },
    matchNumber: {
        type: Number,
        required: true
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    score: {
        type: Map,
        of: Number,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'bye'],
        default: 'pending'
    },
    nextMatch: {
        type: String,
        ref: 'Tournament.matches'
    },
    startTime: Date,
    endTime: Date
}, { _id: false });

const roundSchema = new mongoose.Schema({
    roundNumber: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    matches: [matchSchema]
});

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameType: {
        type: String,
        enum: ['One Piece TCG', 'Other'],
        default: 'One Piece TCG'
    },
    format: {
        type: String,
        enum: ['single_elimination', 'double_elimination', 'swiss', 'round_robin'],
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    maxParticipants: {
        type: Number,
        required: true,
        min: 2,
        max: 128
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'registration_open', 'in_progress', 'completed', 'canceled'],
        default: 'scheduled'
    },
    rounds: [roundSchema],
    currentRound: {
        type: Number,
        default: 0
    },
    prizePool: {
        type: Map,
        of: String,
        default: {
            '1st': 'Exclusive promo card + Booster box',
            '2nd': 'Booster box + Playmat',
            '3rd-4th': 'Booster packs + Deck box'
        }
    },
    rules: {
        deckRestrictions: [String],
        timeLimits: {
            match: Number,
            turn: Number
        },
        maxDeckSize: {
            type: Number,
            default: 50
        }
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
tournamentSchema.index({ organizer: 1 });
tournamentSchema.index({ startDate: 1 });
tournamentSchema.index({ status: 1 });

// Virtuals
tournamentSchema.virtual('participantCount').get(function() {
    return this.participants.length;
});

tournamentSchema.virtual('progress').get(function() {
    if (this.status === 'completed') return 100;
    if (this.status === 'scheduled') return 0;
    return Math.min(100, Math.round((this.currentRound / this.rounds.length) * 100));
});

// Pre-save hooks
tournamentSchema.pre('save', function(next) {
    if (!this.endDate && this.startDate) {
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.endDate.getDate() + 1);
    }

    if (this.isModified('participants')) {
        if (this.participants.length > this.maxParticipants) {
            throw new Error('Exceeds maximum participant limit');
        }
    }

    next();
});

// Generate initial bracket structure
tournamentSchema.pre('save', function(next) {
    if (this.isNew && this.format === 'single_elimination') {
        this.rounds = this.generateBracket();
    }
    next();
});

// Instance methods
tournamentSchema.methods.generateBracket = function() {
    const participants = this.participants;
    const bracketRounds = Math.log2(participants.length);
    const rounds = [];

    for (let i = 0; i < bracketRounds; i++) {
        const roundNumber = i + 1;
        const roundName = this.getRoundName(roundNumber, bracketRounds);

        const matches = [];
        const matchesCount = participants.length / Math.pow(2, roundNumber);

        for (let j = 0; j < matchesCount; j++) {
            matches.push({
                roundNumber,
                matchNumber: j + 1,
                status: 'pending'
            });
        }

        rounds.push({
            roundNumber,
            name: roundName,
            matches
        });
    }

    return rounds;
};

tournamentSchema.methods.getRoundName = function(roundNumber, totalRounds) {
    const roundNames = {
        [totalRounds]: 'Final',
        [totalRounds - 1]: 'Semi-Finals',
        [totalRounds - 2]: 'Quarter-Finals'
    };

    return roundNames[roundNumber] || `Round ${roundNumber}`;
};

tournamentSchema.methods.addParticipant = function(userId) {
    if (this.participants.includes(userId)) {
        throw new Error('User already registered');
    }

    if (this.participantCount >= this.maxParticipants) {
        throw new Error('Tournament is full');
    }

    if (this.status !== 'registration_open') {
        throw new Error('Registration is closed');
    }

    this.participants.push(userId);
    return this.save();
};

tournamentSchema.methods.advancePlayer = function(matchId, winnerId) {
    const match = this.rounds
        .flatMap(round => round.matches)
        .find(m => m._id === matchId);

    if (!match) throw new Error('Match not found');

    match.winner = winnerId;
    match.status = 'completed';
    match.endTime = new Date();

    if (match.nextMatch) {
        const nextMatch = this.rounds
            .flatMap(round => round.matches)
            .find(m => m._id === match.nextMatch);

        if (nextMatch) {
            nextMatch.players.push(winnerId);
            if (nextMatch.players.length === 2) {
                nextMatch.status = 'in_progress';
                nextMatch.startTime = new Date();
            }
        }
    }

    this.currentRound = Math.max(
        this.currentRound,
        Math.ceil(this.rounds.findIndex(r =>
            r.matches.some(m => m.status === 'in_progress')
        ) + 1)
    );

    return this.save();
};

// Static methods
tournamentSchema.statics.findByStatus = function(status) {
    return this.find({ status });
};

tournamentSchema.statics.findByOrganizer = function(organizerId) {
    return this.find({ organizer: organizerId });
};

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;
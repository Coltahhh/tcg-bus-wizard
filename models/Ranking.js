import mongoose from 'mongoose';
import { getEloRating } from '../utils/rankingAlgorithms.js';

const rankingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    totalPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    tournamentPoints: [{
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournament'
        },
        points: {
            type: Number,
            min: 0
        },
        placement: {
            type: Number,
            min: 1
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    matches: {
        wins: {
            type: Number,
            default: 0,
            min: 0
        },
        losses: {
            type: Number,
            default: 0,
            min: 0
        },
        draws: {
            type: Number,
            default: 0,
            min: 0
        },
        winStreak: {
            current: {
                type: Number,
                default: 0,
                min: 0
            },
            max: {
                type: Number,
                default: 0,
                min: 0
            }
        }
    },
    eloRating: {
        type: Number,
        default: 1200,
        min: 0
    },
    tournamentsPlayed: {
        type: Number,
        default: 0,
        min: 0
    },
    rankingHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        points: Number,
        rank: Number,
        eloRating: Number
    }],
    currentRank: {
        type: Number,
        min: 1
    },
    category: {
        type: String,
        enum: ['standard', 'legacy', 'premier'],
        default: 'standard'
    },
    season: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for faster queries
rankingSchema.index({ totalPoints: -1 });
rankingSchema.index({ currentRank: 1 });
rankingSchema.index({ eloRating: -1 });
rankingSchema.index({ category: 1, season: 1 });

// Virtuals
rankingSchema.virtual('winRate').get(function() {
    const totalMatches = this.matches.wins + this.matches.losses + this.matches.draws;
    return totalMatches > 0
        ? (this.matches.wins / totalMatches * 100).toFixed(1)
        : 0;
});

rankingSchema.virtual('averagePoints').get(function() {
    return this.tournamentsPlayed > 0
        ? (this.totalPoints / this.tournamentsPlayed).toFixed(2)
        : 0;
});

// Pre-save hooks
rankingSchema.pre('save', function(next) {
    // Update max win streak
    if (this.matches.winStreak.current > this.matches.winStreak.max) {
        this.matches.winStreak.max = this.matches.winStreak.current;
    }
    next();
});

// Static methods
rankingSchema.statics.updateLeaderboard = async function(season = 1, category = 'standard') {
    const rankings = await this.find({ season, category })
        .sort({ totalPoints: -1 })
        .select('user currentRank');

    return rankings.map((ranking, index) => ({
        user: ranking.user,
        previousRank: ranking.currentRank,
        newRank: index + 1
    }));
};

rankingSchema.statics.resetSeason = async function(newSeason) {
    return this.updateMany(
        {},
        {
            $set: {
                totalPoints: 0,
                'matches.wins': 0,
                'matches.losses': 0,
                'matches.draws': 0,
                'matches.winStreak.current': 0,
                tournamentsPlayed: 0,
                season: newSeason,
                tournamentPoints: [],
                rankingHistory: []
            }
        }
    );
};

// Instance methods
rankingSchema.methods.addTournamentResult = async function(tournamentId, points, placement) {
    this.tournamentPoints.push({
        tournament: tournamentId,
        points,
        placement
    });

    this.totalPoints += points;
    this.tournamentsPlayed += 1;

    if (placement === 1) this.matches.wins += 1;
    else this.matches.losses += 1;

    // Update win streak
    if (placement === 1) {
        this.matches.winStreak.current += 1;
    } else {
        this.matches.winStreak.current = 0;
    }

    return this.save();
};

rankingSchema.methods.updateEloRating = async function(opponentRating, result) {
    const { newRating } = getEloRating(this.eloRating, opponentRating, result);
    this.eloRating = newRating;
    return this.save();
};

const Ranking = mongoose.model('Ranking', rankingSchema);

export default Ranking;
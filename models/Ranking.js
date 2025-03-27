const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RankingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    tournamentPoints: [{
        tournament: {
            type: Schema.Types.ObjectId,
            ref: 'Tournament'
        },
        points: {
            type: Number,
            min: 0
        },
        placement: Number
    }],
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
    ties: {
        type: Number,
        default: 0,
        min: 0
    },
    tournamentsPlayed: {
        type: Number,
        default: 0,
        min: 0
    },
    winRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    recentResults: [{
        type: String,
        enum: ['win', 'loss', 'tie']
    }],
    rankingHistory: [{
        date: Date,
        points: Number,
        rank: Number
    }],
    currentRank: Number
}, { timestamps: true });

// Calculate win rate before saving
RankingSchema.pre('save', function(next) {
    const totalMatches = this.wins + this.losses + this.ties;
    this.winRate = totalMatches > 0 ? Math.round((this.wins / totalMatches) * 100) : 0;
    next();
});

// Static method to update rankings after a tournament
RankingSchema.statics.updateTournamentResults = async function(tournamentId, results) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const result of results) {
            const { userId, points, placement } = result;

            await this.findOneAndUpdate(
                { user: userId },
                {
                    $inc: {
                        totalPoints: points,
                        tournamentsPlayed: 1,
                        wins: placement === 1 ? 1 : 0
                    },
                    $push: {
                        tournamentPoints: { tournament: tournamentId, points, placement },
                        recentResults: { $each: [placement <= 4 ? 'win' : 'loss'], $slice: -10 },
                        rankingHistory: {
                            date: new Date(),
                            points: this.totalPoints + points,
                            rank: 0 // Will be calculated in separate ranking process
                        }
                    }
                },
                { session }
            );
        }

        await session.commitTransaction();
        return true;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

// Indexes for faster querying
RankingSchema.index({ totalPoints: -1 });
RankingSchema.index({ wins: -1 });
RankingSchema.index({ currentRank: 1 });

module.exports = mongoose.model('Ranking', RankingSchema);
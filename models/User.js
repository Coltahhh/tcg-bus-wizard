import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    // Authentication
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    passwordChangedAt: Date,
    refreshToken: {
        type: String,
        select: false
    },

    // Profile
    profile: {
        avatar: {
            type: String,
            default: 'default-avatar.jpg'
        },
        bio: {
            type: String,
            maxlength: [150, 'Bio cannot exceed 150 characters']
        },
        location: String,
        website: {
            type: String,
            validate: [validator.isURL, 'Please provide a valid URL']
        }
    },

    // Roles & Permissions
    role: {
        type: String,
        enum: ['user', 'admin', 'organizer'],
        default: 'user'
    },

    // Social Logins
    googleId: String,
    facebookId: String,

    // Account Status
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationExpires: Date,

    // Tournament Relationships
    tournamentsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament'
    }],
    tournamentsParticipated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament'
    }]

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Password Hashing Middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordChangedAt = Date.now() - 1000;
        next();
    } catch (err) {
        next(err);
    }
});

// Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Query Middleware
userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
});

// Virtuals
userSchema.virtual('profileUrl').get(function() {
    return `/users/${this.username}`;
});

const User = mongoose.model('User', userSchema);

export default User;
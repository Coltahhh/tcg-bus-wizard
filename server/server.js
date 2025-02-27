require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tournamentRoutes = require('./routes/tournaments');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/error');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware (keep this last!)
app.use(errorHandler);

// Default route
app.get('/', (req, res) => {
    res.send('TCGBusWizard API is running');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
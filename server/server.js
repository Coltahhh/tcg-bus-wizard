require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Changed port

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Match frontend port
}));
app.use(express.json());

// Database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Routes
app.get('/', (req, res) => {
    res.send('TCGBusWizard Backend is running!');
});
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/rankings', require('./routes/rankings'));
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// config/production.js
export default {
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 80
};
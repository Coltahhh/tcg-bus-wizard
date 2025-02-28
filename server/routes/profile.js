// server/routes/profile.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

router.get("/profile", authenticate, (req, res) => {
    res.json({
        uid: req.user.uid,
        email: req.user.email,
        // Add other user data from your database
    });
});

module.exports = router;
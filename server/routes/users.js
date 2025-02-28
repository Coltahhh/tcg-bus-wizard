// server/routes/users.js
const express = require("express");
const router = express.Router();
const admin = require("../firebaseAdmin");
const authenticate = require("../middleware/authMiddleware");

// Get user profile
router.get("/:userId", authenticate, async (req, res) => {
    try {
        const userDoc = await admin.firestore().doc(`users/${req.params.userId}`).get();
        if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put("/:userId", authenticate, async (req, res) => {
    try {
        await admin.firestore().doc(`users/${req.params.userId}`).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
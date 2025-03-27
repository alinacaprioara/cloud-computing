const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, apiKey } = req.body;

    if (!username || !apiKey) {
        return res.status(400).json({ error: 'Missing username or API key' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Invalid API key' });
    }

    // Just send back success for now (you could later add a JWT or session ID)
    res.status(200).json({ message: 'Login successful', username });
});

module.exports = router;

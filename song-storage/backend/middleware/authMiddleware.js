module.exports = function (req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.body.apiKey;

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

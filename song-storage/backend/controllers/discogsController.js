const discogsService = require('../services/discogsService');

exports.search = async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
    }

    try {
        const results = await discogsService.searchReleases(query);
        res.json(results);
    } catch (error) {
        console.error('Discogs search error:', error.message);
        res.status(500).json({ error: 'Failed to fetch search results from Discogs' });
    }
};

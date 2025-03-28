const axios = require('axios');

const DISCOGS_BASE_URL = 'https://api.discogs.com';
const { DISCOGS_CONSUMER_KEY, DISCOGS_CONSUMER_SECRET, USER_AGENT } = process.env;

exports.searchReleases = async (query) => {
    const response = await axios.get(`${DISCOGS_BASE_URL}/database/search`, {
        headers: {
            'User-Agent': USER_AGENT,
        },
        params: {
            q: query,
            key: DISCOGS_CONSUMER_KEY,
            secret: DISCOGS_CONSUMER_SECRET,
        },
    });

    return response.data.results;
};

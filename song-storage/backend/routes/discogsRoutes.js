const express = require('express');
const router = express.Router();
const discogsController = require('../controllers/discogsController');

router.get('/search', discogsController.search);

module.exports = router;

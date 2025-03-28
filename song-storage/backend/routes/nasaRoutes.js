const express = require('express');
const router = express.Router();
const nasaController = require('../controllers/nasaController');

router.get('/nasa/search', nasaController.searchImage);

module.exports = router;

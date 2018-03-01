var express = require('express');
var getTickets = require('../controllers/EventsController');
var router = express.Router();

router.get('/:location/:genre', getTickets);

module.exports = router;

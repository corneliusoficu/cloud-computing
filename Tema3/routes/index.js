var express = require('express');
var router = express.Router();
var logger = require('../logger');

/* GET home page. */
router.get('/', function(req, res, next) {

    logger.log('INFO', 'Get on homepage!');
    res.render('index', { title: 'Express' });
});

router.get('/pozetata', function(req, res, next) {
    logger.log('INFO', 'GET on pozetata');
    res.render('photos', { title: 'Poze' });
});

module.exports = router;

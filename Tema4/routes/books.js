//TODO: 
// Books - getall
// Books - get/post
// Books - upload of thumbnail image

// Database for users and books
// Models

var express = require('express');
var router = express.Router();

var books_controller = require('../controllers/books_controller');

router.get('/', books_controller.book_list); //TODO: move to books route
router.post('/', books_controller.save_book);

module.exports = router;
var express = require('express');
var router = express.Router();

var users_controller = require('../controllers/users_controller');

router.route('/').get(users_controller.get_login_page);
router.route('/login').get(users_controller.get_login_page);
router.route('/register').get(users_controller.get_register_page);
router.route('/login').post(users_controller.login_user);
router.route('/register').post(users_controller.register_user);

module.exports = router;

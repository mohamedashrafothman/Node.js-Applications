var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', {title: 'Users'});
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});
module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, (req, res, next)=> {
  res.render('index', { title: 'Home Page' });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;

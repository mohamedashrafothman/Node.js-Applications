var express = require('express');
var router = express.Router();
const User = require('../models/user');
/* GET users listing. */
router.get('/', (req, res, next)=> {
  res.render('users', {title: 'Users'});
});

router.get('/register', (req, res, next)=> {
  res.render('register', {title: 'Register', errors: false});
});
router.get('/login', (req, res, next)=> {
  res.render('login', {title: 'Login'});
});

router.post('/register', (req, res, next)=> {
    // get form variables
    var name        = req.body.name;
    var email       = req.body.email;
    var username    = req.body.username;
    var password    = req.body.password;
    var password2   = req.body.password2;
    // profile Image
    var profileImageOriginalName;
    var profileImageName;
    var profileImageMime;
    var profileImagePath;
    var profileImageExt;
    var profileImageSize;


    // chek for image filed
    if(req.files.profile_image){
        console.log('Uploading File...');
        profileImageOriginalName    = req.files.profile_image;
        profileImageName            = req.files.profile_image.name;
        profileImageMime            = req.files.profile_image.mimetype;
        profileImagePath            = req.files.profile_image.path;
        profileImageExt             = req.files.profile_image.extension;
        profileImageSize            = req.files.profile_image.size;
    } else  {
        profileImageName = 'noimage.png';
    }

    req.checkBody('name', 'Name Field is required').notEmpty();
    req.checkBody('email', 'Email Field is required').notEmpty();
    req.checkBody('email', 'Email Not Valid').isEmail();
    req.checkBody('username', 'UserName Field is required').notEmpty();
    req.checkBody('password', 'Password Field is required').notEmpty();
    req.checkBody('password2', 'Passwords Not match').equals(req.body.password);

    // check for errors
    req.getValidationResult().then((result)=> {
        if(!result.isEmpty()){
            var errors = result.array();
            res.render('register', {
                title: 'Register',
                errors: errors,
                name: name,
                email: email,
                username: username,
                password: password,
                password2: password2
            });
        } else {
            var newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password,
                profileImage: profileImageName
            });

            //create Users
            User.createUser(newUser, (error, user)=> {
                if(error) throw error;
                console.log(user);
            });

            // success Message
            req.flash('success', 'You are now register and may login');

            res.location('/');
            res.redirect('/');
        }
    });


});
module.exports = router;

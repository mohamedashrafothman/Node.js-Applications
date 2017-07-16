const express           = require('express');
const passport          = require('passport');
const localStrategy     = require('passport-local').Strategy;
const User              = require('../models/user');
const router            = express.Router();


router.get('/', (req, res, next)=> {
  res.render('users', {title: 'Users'});
});

router.get('/login', (req, res, next)=> {
  res.render('login', {title: 'Login'});
});

passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.deserializeUser((id, done)=> {
    User.getUserById(id, (err, user)=> {
        done(err, user);
    });
});
passport.use(new localStrategy(
    (username, password, done)=> {
        User.getUserByUsername(username, (err, user)=> {
            if(err) throw err;
            if(!user){
                console.log('Unkown user');
                return done(null, false, {message: 'unkown User'});
            }

            User.comparePassword(password, user.password, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));
router.post('/login', passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'invalid username or password'}), (req, res)=>{
    console.log('Authenication Successful');
    req.flash('success', 'You are logged in');
    res.redirect('/');
});
router.get('/logout', (req, res)=> {
    req.logout();
    req.flash('success', 'you have logged out');
    res.redirect('/users/login');
});

router.get('/register', (req, res, next)=> {
  res.render('register', {title: 'Register', errors: false});
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

    console.log(req.body.profile_image);
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

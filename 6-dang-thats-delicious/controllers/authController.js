const passport = require('passport');


const login = passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: 'Faild Login',
	successRedirect: '/',
	successFlash: 'You now logged in'
});

const logout = (req, res)=> {
	req.logout();
	req.flash('success', 'You are now logged out 👋');
	res.redirect('/');
};

const isLoggedIn = (req, res, next)=> {
	if(req.isAuthenticated()){
		next();
		return;
	}
	req.flash('error', 'Oops you must be logged in to do that');
	res.redirect('/login');
};

module.exports = {
	login,
	logout,
	isLoggedIn
};
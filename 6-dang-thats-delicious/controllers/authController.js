const passport = require('passport');
// crypto is a nodejs core module
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify'); 
const mail = require('../handlers/mail.js');

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

const forgot = async (req, res)=> {
	// 1- see ig a user with that email exist
	// 2- set reset token and expiry on their account
	// 3- send them an email with the token 
	// 4- redirect to loign page
	const user = await User.findOne({email: req.body.email});
	if(!user){
		req.flash('error', 'No account with that email exist!');
		return res.redirect('/login');
	}

	user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
	user.resetPasswordExpores = Date.now() + 3600000;
	await user.save();	
	
	const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
	await mail.send({
		user: user,
		filename: 'password-reset', 
		subject: 'password reset',
		resetUrl: resetUrl
	});

	req.flash('success', `You have been emailed a password link.`);
	res.redirect('/login');
};

const reset = (req, res)=> {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpores: {$gt: Date.now()}
		}).then((result)=> {
			// is there is no user show error flash message then redirect to login page
			if(!result){
				req.flash('error', 'Password reset is invalid or has expired');
				return res.redirect('/login');
			}
			// if there is a user, show the reset password form
			res.render('reset', {title: 'Reset Your Password'});
		});
};

const confirmedPasswords = (req, res, next)=> {
	if(req.body.password === req.body['password-confirm']){
		next();
		return;
	}
	req.flash('error', 'Passwords do not match!');
	res.redirect('back');
};
const update = async (req, res)=> {
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpores: {$gt: Date.now()}
	});

		if(!user){
			req.flash('error', 'Password reset is invalid or has expired');
			return res.redirect('/login');
		}
		const setPassword = promisify(user.setPassword, user);
		await setPassword(req.body.password);

		user.resetPasswordToken = undefined;
		user.resetPasswordExpores= undefined;

		const updateUser = await user.save();
		await req.login(updateUser);

		req.flash('success', 'Your password has been reset! You are logged in!');
		res.redirect('/');
};

module.exports = {
	login,
	logout,
	isLoggedIn,
	forgot,
	reset,
	confirmedPasswords,
	update
};
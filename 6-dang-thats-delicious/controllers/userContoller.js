const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');


const loginForm = (req, res)=> {
	res.render('login', {
		title: "Login"
	});
};
const registerForm = (req, res)=> {
	res.render('register', {title: 'Register'});
};

const validateRegister = (req, res, next)=> {
	// express-validation method from methods that validator asssign to request
	req.sanitizeBody('name');
	req.checkBody('name', 'You must supply a name!').notEmpty();
	req.checkBody('email', 'That Email is not Valied!').isEmail();
	req.sanitizeBody('email');
	req.checkBody('password', 'Password cannot be Blank!').notEmpty();
	req.checkBody('password-confirm', 'Confirm password cannot be blank!').notEmpty();
	req.checkBody('password-confirm', 'Your passwords don\'t match! ').equals(req.body.password);

 	req.getValidationResult().then((result)=> {
 		if(!result.isEmpty()){
 			var errors = result.array();
			req.flash('error', errors);
			res.render('register', {
				title: 'Register',
				body: req.body,
				flashes: req.flash()
			});
			return;
 		}
 	});
 	next();
};

const register = async (req, res, next)=> {
	const user = new User({
		email: req.body.email,
		name: req.body.name
	});

	const register = promisify(User.register, User);
	await register(user, req.body.password);

	next();
};	

const account = (req, res)=> {
	res.render('account', {
		title: 'Edit Your account'
	});
};

const updateAccount = (req, res)=> {
	const updates = {
		name: req.body.name,
		email: req.body.email
	};

	// find user from database, update it then send it
	User.findOneAndUpdate({ _id: req.user._id }, 
		{ $set: updates }, 
		{new: true, runValidators: true, context: 'query' })
	.then((result)=>{
		req.flash('success', 'Updated the profile!');
		res.redirect('back'); // it send right back to the prev url
	});
};


module.exports = {
	loginForm,
	registerForm,
	validateRegister,
	register,
	account,
	updateAccount
};
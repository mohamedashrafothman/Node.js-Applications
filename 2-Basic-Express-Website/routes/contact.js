var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/send', function(req, res, next){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user:'mido.ma201096@gmail.com',
			pass: 'something'
		}
	});

	var mailOptions = {
		from: 'John Doe <johndoe@outlook.com>',
		to: 'mido.ma201096@gmail.com',
		subject: 'website Submission',
		text: 'You have a new submission with following details....Name '+req.body.name+' Email: '+req.body.email+' Message: '+req.body.message,
		html: '<p>Tou got a new Submission with the following details</p><ul><li>Name'+req.body.name+'</li><li>Name'+req.body.email+'</li><li>Name'+req.body.message+'</li></ul>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			res.redirect('/');
		} else {
			console.log(`Message Sent: ${info.response}`);
			res.redirect('/');

		}
	});
});

module.exports = router;

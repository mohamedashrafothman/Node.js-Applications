const mongoose = require('mongoose');
const Review = mongoose.model('Review');


const addReview = async (req, res)=> {
	req.body.author = req.user._id;
	req.body.store = req.params.id;
	const newReview = new Review(req.body);
	await newReview.save();
	req.flash('success', 'Review Saved!');
	res.redirect('back');
};


module.exports = {
	addReview
};
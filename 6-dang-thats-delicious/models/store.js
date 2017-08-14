/*===============================================================================================
	REQUIRING DEPENDENCIES
		- mongoose: a module for dealing with MnogoDB
		- slugs: a module for parsing URL to uniqu URL [mohamed ashraf] ==> [mohamed-ashraf]
		- schema: fire mongoose schema constructor class
===============================================================================================*/
const slug = require('slugs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


/*===============================================================================================
	STORE SCHEMA
		- name: represent store name and make it trim and require.
		- slug: represent slug name, it's a store's name but replacing spaces by dashes.
		- description: represent store's bio and make it trim to remove spaces.
		- tage: represent store's tags array.
		- creadet: represent store making time when added to the database.
		- location: represent store's location and it's type, coordenates and address.
		- poto: represent store's photo name.
===============================================================================================*/
const storeSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter a store name'
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	tags: [String],
	creadet: {
		type: Date,
		default: Date.now
	},
	location: {
		type: {
			type: String,
			default: 'point'
		},
		coordinates: [{
			type: Number,
			required: 'You must supply coordinates'
		}],
		address: {
			type: String,
			required: 'You must supply an address'
		}
	},
	photo: String,
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author'
	}
}, {
	toJSON: {virtual: true},
	toObject: {virtual: true}
});


// defind our indexes
// storeSchema.index({
// 	'location': '2dsphere'
// });
storeSchema.index({
	name: 'text',
	description: 'text'
});

// run slug module middleware
storeSchema.pre('save',async function(next){
	if(!this.isModified('name')){
		next(); // stop it
		return; // stop the function from running
	}
	this.slug = slug(this.name);
	// solve the issues that have the same name
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const storeWithSlug = await this.constructor.find({slug: slugRegEx});
	if(storeWithSlug.length){
		this.slug = `${this.slug}-${storeWithSlug.length + 1}`;
	}

	next();
});

// make getTagsist function that return filtered data.
storeSchema.statics.getTagsList = function(){
	return this.aggregate([
		{ $unwind: '$tags' },
		{ $group: {_id: '$tags', count: {$sum: 1} } },
		{ $sort: {count: -1} }
	]);
};

// this piece of code means: find reviews where the
// stores _id property === reviews store prop propity
storeSchema.virtual('reviews', {
	ref: 'Review', // what model to link?
	localField: '_id', // which field on the store?
	foreignField: 'store' // which field on the view?
});

// exporting store's module.
module.exports = mongoose.model('Store', storeSchema);
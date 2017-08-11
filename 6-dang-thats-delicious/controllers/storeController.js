/*=======================================================================================
	REQUIRING DEPENDENCIES
		- mongoose: a module for dealing with MnogoDB
		- multer: a module for dealing with uploading files
		- jimp: a module for resize photos.
		- uuid: a module for make names of photos uniqe.
		- multerOptions: it's an object that represent uploading 
			files moldule multer's options, like storage and filefilter function.
=======================================================================================*/
const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const Store = mongoose.model('Store');
const multerOptins = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next){
		const isPhoto = file.mimetype.startsWith('image/');
		if(isPhoto){
			next(null, true);
		}else{
			next({message: 'That fileType isn\'t allowed! '});
		}
	}
};

/*================================================================================================================
	CONTROLLER METHODS
		- homePage: rendering home page.
		- addStore: rendering editStore that have edit and add stores functions.
		- createStore: create new class store, saving it to the database then render to /stores page.
		- getStore: get all stores from the database, then render to /stores page with this data.
		- confirmOwner: confinrm the owner of the store.
		- editStore: search for existing store by it's unique id then render to /editStore page with it's data.
		- updateStore: find existing store, update it, send it back to the DB and render it's page.
		- getStoreBySlug: get store object from the database then render it's page by passing it to /store/slug.
		- getStoreByTag: get all tags and stores from the database for viwing them in /tags page.
		- resize: a middleware for resizing photos.
		- searchStores: function to represent stores data api for searching functionality
================================================================================================================*/
const homePage = (req, res)=> {
	res.render('index', {title: 'Home Page'});
};

const addStore = (req, res)=> {
	res.render('editStore', {
		title: 'Add Store'
	});
};

const upload = multer(multerOptins).single('photo');
const resize = async (req, res, next)=> {
	// check if there is no new file to resize
	if(!req.file){
		next(); // skip to the next middleware
		return;
	}
	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extension}`;
	// resize photos
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(8000, jimp.AUTO);
	await photo.write(`./public/uploads/${req.body.photo}`);
	next();
};

const createStore = (req, res)=> {

	 // Form Validator
    req.checkBody('name', 'Name Field is required').notEmpty();
    req.checkBody('description', 'description Field is required').notEmpty();
    req.checkBody('location[address]', 'Address Field is required').notEmpty();
    req.checkBody('location[coordinates][0]', 'Address Lng Field is required').notEmpty();
    req.checkBody('location[coordinates][1]', 'Address Lat Field is required').notEmpty();

    // check for errors
    req.getValidationResult().then((result)=> {
        if(!result.isEmpty()){
            var errors = result.array();
			req.flash('error', errors);
			res.render('editStore', {
				title: 'Add Store',
				flashes: req.flash()
			});
        }else{
			req.body.author = req.user._id;
			const store = new Store(req.body);
			store.save().then((result)=> {
				console.log('New Store Added to the database ❤');
				req.flash('success', `Successfully created ${result.name} store. Care to leave a review?`);
				res.redirect('/stores');
			}).catch((err)=> {
				throw err;
			});
        }
	});
};

const getStores = (req, res)=> {
	const stores = Store.find().then((result)=> {
		res.render('stores', {title: 'Stores', stores: result});
	});
};

const confirmOwner = (store, user)=> {
	if(!store.author.equals(user._id)){
		req.flash('error', 'You must own a store in order to edit it');
		res.redirect('/stores');
	}
};

const editStore = (req, res)=> {
	const store = Store.findOne({_id: req.params.id}).then((result)=> {
		confirmOwner(result, req.user);
		res.render('editStore', {title: `edit ${result.name} store`, store: result});
	}).catch((err)=> {
		throw err;
	});
};

const updateStore = (req, res)=> {
	// seet the locatin data to be a point
	req.body.location.type = 'Point';
	const id= req.params.id;
	const store = Store.findOneAndUpdate({_id: id}, req.body, {
		new: true, // return new store instead of the old one
		runValidators: true
	}).then(()=> {
		Store.findOne({_id: id}).then((result)=> {
			req.flash('success', `Successfully updated <strong>${result.name}</strong>, <a href="/store/${result.slug}">View store ➡</a>`);
			res.redirect(`/stores`);
		}).catch((err)=> {
			throw err;
		});
	});
};

const getStoreBySlug = (req, res)=> {
	const store = Store.findOne({slug: req.params.slug}).populate('author').then((result)=> {
		if(!result) return next();
		res.render('store', {
			store: result,
			title: result.name
		});
	});
};

const getStoresByTag = (req, res)=> {
	const tag = req.params.tag;
	const tagQuery = tag || {$exists: true};
	const tags = Store.getTagsList().then((result_1)=> {
		const stores = Store.find({tags: tagQuery}).then((result_2)=> {
			res.render('tags', {tags: result_1, title: 'Tags', tag, stores: result_2});
		});
	});
};

// Send API's Stores Data
const searchStores = (req, res)=> {
	Store.find({
		$text: {
			$search: req.query.q,
		}
	},
	{
		score: { $meta: 'textScore' }
	}).sort({ score: {$meta: 'textScore'} }).limit(5).then((result)=>{
		res.json(result);
	});
};


module.exports = {
	homePage,
	addStore,
	upload,
	resize,
	createStore,
	getStores,
	editStore,
	updateStore,
	getStoreBySlug,
	getStoresByTag,
	searchStores
};
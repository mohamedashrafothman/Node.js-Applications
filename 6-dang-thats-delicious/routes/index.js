/*===============================================================================================
	REQUIRING DEPENDENCIES
		- express
		- express.Routes: method that set routes to it
===============================================================================================*/
const express          = require('express');
const router           = express.Router();
// all controllers that used in this routes file
const storeController  = require('../controllers/storeController.js');
const userContoller    = require('../controllers/userContoller.js');
const authController   = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
// catch error function from errorHandelers file
const { catchErrors }  = require('../handlers/errorHandlers');


/*==================================================
		STORE's ROUTES
			- home page routes
			- store's view routes
			- add new store's route
			- tags view routes
==================================================*/
router.get('/', storeController.getStores);
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/store/:slug', storeController.getStoreBySlug);
router.get('/stores/:id/edit', storeController.editStore);
router.get('/add', authController.isLoggedIn, storeController.addStore);
router.post('/add', storeController.upload, catchErrors(storeController.resize) ,storeController.createStore);
router.post('/add/:id', storeController.upload, catchErrors(storeController.resize), storeController.updateStore);
router.get('/tags', storeController.getStoresByTag);
router.get('/tags/:tag', storeController.getStoresByTag);


/*=============================
	USER's ROUTES
	______________
		*registeration*
			we need to
				1- validate the register data.
				2- register the user.
				3- we need to log them in.
=============================*/
router.get('/register', userContoller.registerForm);
router.post('/register', 
	userContoller.validateRegister, 
	catchErrors(userContoller.register), 
	authController.login
);
router.get('/login', userContoller.loginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/account', authController.isLoggedIn, userContoller.account);
router.post('/account', userContoller.updateAccount);
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', authController.reset);
router.post('/account/reset/:token', 
	authController.confirmedPasswords, 
	catchErrors(authController.update)
);
router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));
router.get('/top', catchErrors(storeController.getTopStores));
/*=============================
	APIs
=============================*/
router.get('/api/search', storeController.searchStores);
// router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));



module.exports = router;
/*===============================================================================================
	REQUIRING DEPENDENCIES
		- express
		- express.Routes: method that set routes to it
===============================================================================================*/
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController.js');
const userContoller = require('../controllers/userContoller.js');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');


/*=============================
		STORE's ROUTES
=============================*/
router.get('/', storeController.getStores);
router.get('/stores', storeController.getStores);
router.get('/add', authController.isLoggedIn, storeController.addStore);
router.post('/add', storeController.upload, catchErrors(storeController.resize) ,storeController.createStore);
router.post('/add/:id', storeController.upload, catchErrors(storeController.resize), storeController.updateStore);
router.get('/stores/:id/edit', storeController.editStore);
router.get('/store/:slug', storeController.getStoreBySlug);
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
router.get('/login', userContoller.loginForm);
router.post('/login', authController.login);
router.get('/register', userContoller.registerForm);
router.post('/register', userContoller.validateRegister, catchErrors(userContoller.register), authController.login);
router.get('/logout', authController.logout);
router.get('/account', authController.isLoggedIn, userContoller.account);
router.post('/account', userContoller.updateAccount);
router.post('/account/forgot', authController.forgot);
router.get('/account/reset/:token', authController.reset);
router.post('/account/reset/:token', authController.confirmedPasswords, catchErrors(authController.update));


module.exports = router;
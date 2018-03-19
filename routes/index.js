const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const genericController = require('../controllers/genericController');
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const reviewController = require('../controllers/reviewController');
const mailController = require('../controllers/mailController');
const { catchErrors } = require('../handlers/errorHandlers');

// Generic Routes
router.get('/', catchErrors(storeController.homePage));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/wholesalers', catchErrors(storeController.getWholesale));
router.get('/wholesalers/page/:page', catchErrors(storeController.getWholesale));
router.get('/state/:state', catchErrors(storeController.getStoresByState));
router.get('/map', storeController.mapPage);
router.get('/about', genericController.aboutPage);
router.get('/privacy', genericController.privacyPage);
router.get('/terms', genericController.termsPage);
router.get('/contact', genericController.contactPage);
router.post('/contact', catchErrors(genericController.contactPage));
router.get('/sitemap.xml', genericController.sitemap);

// Store
router.get('/add', 
  authController.isLoggedIn,
  authController.isVendor,
  storeController.addStore
);
router.post('/add',
  authController.isLoggedIn,
  authController.isVendor,
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post('/add/:id',
  authController.isLoggedIn,
  storeController.upload,
  catchErrors(storeController.deletePhotos),
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
router.post('/reviews/:id',
  authController.isLoggedIn,
  authController.isNotVendor,
  catchErrors(reviewController.addReview)
);

// Store Products
router.post('/stores/:id/products/add',
  authController.isLoggedIn,
  authController.isVendor,
  productController.upload,
  catchErrors(productController.resize),
  catchErrors(productController.addProduct)
);
router.post('/stores/:id/products/:productid/edit',
    authController.isLoggedIn,
    authController.isVendor,
    productController.upload,
    catchErrors(productController.resize),
    catchErrors(productController.editProduct)
);

// User
router.get('/register', userController.registerForm);
router.post('/register',
  catchErrors(userController.validateRegister),
  catchErrors(userController.register),
  authController.login
);
// Vendor
router.post('/register/vendor',
  catchErrors(userController.validateRegister),
  catchErrors(userController.registerVendor),
  authController.vendorRegister
);
// Generic User
router.get('/login', userController.loginForm);
router.post('/login', authController.loginEmail, authController.login);
router.get('/logout', authController.logout, authController.redirectHome);
router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
authController.confirmedPasswords,
catchErrors(authController.update)
);

// forgot password route
router.get('/password/forgot', userController.forgotPasswordForm);

// redirect to forgot password route from the user account section
// to maintain security the password cannot be changed while the user is logged in
// the password reset token must be sent to verify the user who requested the reset is the same as the one who registered with the email
router.get('/account/password/forgot', authController.logout, userController.forgotPasswordForm);


// Admin section
router.get('/admin/stores',
  authController.isLoggedIn,
  authController.isAdmin,
  catchErrors(adminController.searchPage)
);
router.get('/admin/stores/page/:page',
  authController.isLoggedIn,
  authController.isAdmin,
  catchErrors(adminController.searchPage)
);
router.post('/admin/store/:store',
  authController.isLoggedIn,
  authController.isAdmin,
  catchErrors(adminController.deleteStoreById)
);
router.get('/admin/store/:slug',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(adminController.reviewsBySlug)
);
router.post('/admin/store/:slug/:review',
  authController.isLoggedIn,
  authController.isAdmin,
  catchErrors(adminController.deleteReviewById)
);
router.get('/admin/store/:slug/products',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(adminController.productsBySlug)
);
router.post('/admin/store/:slug/product/:product',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(adminController.deleteProductById)
);
router.get('/admin/store/alts/:slug',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(adminController.altsBySlug)
);
router.post('/admin/store/:slug/alts/:id',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(adminController.editAltsBySlug)
);

/*
  API
*/

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));
// promote
router.post('/api/store/promote/:store/:author',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(storeController.createPromoted)
);
router.post('/api/store/demote/:store/:author',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(storeController.removePromoted)
);
router.post('/api/email/submit',
    catchErrors(userController.validateEmailSubmit),
    catchErrors(userController.emailSubmit)
);

// send mail routes
router.post('/api/mail/send', mailController.send);

module.exports = router;

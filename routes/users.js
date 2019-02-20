// USERS ROUTES
const express	= require('express');
const router	= express.Router(); // similar to const app in server.js
const passport	= require('passport'); // we need to use passport for creating protective route

// LOAD USER MODEL
const User = require('../models/User');

// LOAD USER CONTROLLERS
const UserRegistration 	= require('../controllers/UserRegisterController');
const UserLogin 		= require('../controllers/UserLoginController');
const UserCurrent		= require('../controllers/UserCurrentController');

// GET USERS ROUTE -- PUBLIC
// u don't need to include previous path '/users' from server.js, just the next part
// also, 'res.json()', as u probably know, its like res.send but it outputs json file 
router.get('/user', (req, res) => res.json({ test: 'Works' }));

// POST USER REGISTRATION ROUTE -- PUBLIC
// creation of user, sending post request
router.post('/register', UserRegistration.user_registration);

// POST USER LOGIN ROUTE -- PUBLIC
// login user with JWT TOKEN
router.post('/login', UserLogin.user_login);

// GET LOGGED USER ROUTE -- PRIVATE
// 'jwt' - it's an strategy which we're using
// more info about authentication process docs: http://www.passportjs.org/docs/
router.get('/current', passport.authenticate('jwt', { session: false }), UserCurrent.current_user);

module.exports = router;
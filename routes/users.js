// USERS ROUTES
const express	= require('express');
const router	= express.Router(); // similar to const app in server.js
const bcrypt	= require('bcryptjs'); // for hashing password / docs: https://github.com/dcodeIO/bcrypt.js 
const passport	= require('passport'); // we need to use passport for creating protective route
const gravatar	= require('gravatar');
const jwt 		= require('jsonwebtoken');

// LOAD USER MODEL
const User 		= require('../models/User');

// GET USERS ROUTE -- PUBLIC
// u don't need to include previous path '/users' from server.js, just the next part
// also, 'res.json()', as u probably know, its like res.send but it outputs json file 
router.get('/user', (req, res) => res.json({ test: 'Works' }));

// POST USER REGISTRATION ROUTE -- PUBLIC
// creation of user, sending post request
router.post('/register', (req, res) => {
	// check if user email exists
	User.findOne({ email: req.body.email })
		.then(user => {
			// check for user
			if(user) {
				// if user exists, then we're throwing error message, like 'Email already exists'
				// the status of that http request is 400
				return res.status(400).json({ email: 'Email already exists' });
			} else {
				// u can check the docs here: https://www.npmjs.com/package/gravatar
				const avatar = gravatar.url(req.body.email, {s: '100', r: 'pg', d: 'mm'});
				// if email is valid, we're creating new user
				// when u wanna enter new data to your db(mongoDB) u just pass the object with your data to 'new User()',
				// where User is your model's name // 'req.body' part comes with body-parser, which refers to your frontend form
				const newUser = new User({
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
					// 'avatar', it'll be from gravatar - npm package, which takes profile pic from user's email
					// I found few tutorials on implementing that, it's quite popular, so I thought 'why not'
					avatar
				});

				// salt generation
				// it's an async method, which u can find in docs
				const salt = bcrypt.genSalt(10, (err, salt) => {
					// hash
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err) throw error;
						// if error wasn't found, then we're hashing that new created password
						newUser.password = hash;
						// and now we're saving new User to db, using mongoose
						newUser.save()
							.then(user => res.json(user))
							.catch(err => console.log(err));
					});
				});
			}
		})
		.catch(err => console.log(err));
});

// POST USER LOGIN ROUTE -- PUBLIC
// login user with JWT TOKEN
router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	// Find user by email
	User.findOne({ email })
		.then(user => {
			// Checking user
			if(!user) {
				res.status(404).json({ email: 'User not found' })
			}
		
			// Checking password
			// method from bcrypt docs / user.password is the password hash from user
			bcrypt.compare(password, user.password)
			// comparison promise
				.then(isValid => {
					if(isValid) {
						// sign jwt token, docs: https://www.npmjs.com/package/jsonwebtoken
						// payload - basically user information assing to token
						const payload = { id: user.id, username: user.username, avatar: user.avatar };
						// u need to also include key for token
						const key = process.env.TOKEN_KEY;
						jwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
							res.json({ 
								success: true,
								token: 'Bearer ' + token // definition: https://stackoverflow.com/questions/25838183/what-is-the-oauth-2-0-bearer-token-exactly
							})
						});
					} else {
						return res.status(400).json({ password: 'Password incorrect' });
					}
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});

// GET LOGGED USER ROUTE -- PRIVATE
// 'jwt' - it's an strategy which we're using
// more info about authentication process docs: http://www.passportjs.org/docs/
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	// because we returned user object in jwtStrategy, we can now access that object and return our own without passport
	res.json({
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		date: req.user.date
	});
});

module.exports = router;
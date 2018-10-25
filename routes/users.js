// USERS ROUTES
const express	= require('express');
const router	= express.Router(); // similar to const app in server.js

// LOAD USER MODEL
const User 		= require('../models/User');

// GET USERS ROUTE -- PUBLIC
// u don't need to include previous path '/users' from server.js, just the next part
// also, 'res.json()', as u probably know, its like res.send but it outputs json file 
router.get('/user', (req, res) => res.json({ test: 'Works' }));

//POST USER REGISTRATION ROUTE -- PUBLIC
// creation of user, sending post request
router.post('/register', (req, res) => {
	// check if user email exists
	User.findOne({ email: req.body.email })
		.then(user => {
			// check for user
			if(user) {
				// if user exists, then we're throwing error message, like 'Email already exists'
				// the status of that http request is 400
				res.status(400).json({ email: 'Email already exists' });
			} else {
				// u can check the docs here: https://www.npmjs.com/package/gravatar
				const avatar = gravatar.url(res.body.email, {s: '100', r: 'pg', d: 'mm'});
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
			}
		})
});



module.exports = router;
// USERS ROUTES
const express	= require('express');
const router	= express.Router(); // similar to const app in server.js
const bcrypt	= require('bcryptjs'); // for hashing password / docs: https://github.com/dcodeIO/bcrypt.js 
const gravatar	= require('gravatar');

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
							.then(user => res.json())
							.catch(err => console.log(err));
					});
				});
			}
		})
		.catch(err => console.log(err));
});



module.exports = router;
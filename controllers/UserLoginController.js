// USER LOGIN
exports.user_login = function(req, res) {
	// LOAD FORM VALIDATION
	const loginValidation = require('../validation/loginForm');
	// LOAD BCRYPT & JWT
	const bcrypt	= require('bcryptjs'); // for hashing password / docs: https://github.com/dcodeIO/bcrypt.js 
	const jwt 		= require('jsonwebtoken');
	const email = req.body.email;
	const password = req.body.password;
	const { errorsMsgs, isValid } = loginValidation(req.body);
	
	// login validation
	if(!isValid) {
		return res.status(400).json(errorsMsgs);
	}

	// Find user by email
	User.findOne({ email }).then(user => {
		// Checking user
		if(!user) {
			errorsMsgs.email = 'User not found';
			res.status(404).json(errorsMsgs);
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
				errorsMsgs.password = 'Password incorrect';
				return res.status(400).json(errorsMsgs);
			}
		})
		.catch(err => console.log(err));
	})
	.catch(err => console.log(err));
}
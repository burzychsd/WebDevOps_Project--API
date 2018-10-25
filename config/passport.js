// PASSPORT JWT STRATEGY docs: https://github.com/themikenicholson/passport-jwt
const JwtStrategy 	= require('passport-jwt').Strategy;
const ExtractJwt 	= require('passport-jwt').ExtractJwt;
// We need to use mongoose methods
const mongoose 		= require('mongoose');
const User 			= mongoose.model('users');
// Also, we will need tokenKey
const tokenKey = process.env.TOKEN_KEY;

//OPTIONS
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = tokenKey;

// now we exporting passport function / see server.js
module.exports = passport => {
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		// Looking for proper user using mongoose 'findById' method
		User.findById(jwt_payload.id)
			.then(user => {
				if(user) {
					return done(null, user);
				}
				return done(null, false);
			})
			.catch(err => console.log(err));
	}));
}




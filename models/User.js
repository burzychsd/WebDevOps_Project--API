// USER SCHEMA
const mongoose	= require('mongoose');
const Schema  	= mongoose.Schema;

// CREATE SCHEMA
const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

// the first argument here is the name of our collection 'users' - u can specify how u want that name
// the second argument is that Schema which we created above
// 'User' is just an variable, which we export
module.exports = User = mongoose.model('users', UserSchema);
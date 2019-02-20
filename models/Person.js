// PERSON SCHEMA
const mongoose	= require('mongoose');
const Schema  	= mongoose.Schema;

const PersonSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String
	}
});

module.exports = Person = mongoose.model('persons', PersonSchema);
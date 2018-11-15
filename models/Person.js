// PERSON SCHEMA
const mongoose	= require('mongoose');
const Schema  	= mongoose.Schema;

const PersonSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String
	}
});

module.exports = Person = mongoose.model('persons', PersonSchema);
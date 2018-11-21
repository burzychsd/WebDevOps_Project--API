// NOTE SCHEMA
const mongoose	= require('mongoose');
const Schema  	= mongoose.Schema;

const NoteSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	title: {
		type: String
	},
	text: {
		type: String
	},
	color: {
		type: String,
		default: '#EBEBEB'
	},
	alarm: {
		type: Date
	},
	persons: [{
		type: Schema.Types.ObjectId,
		ref: 'persons'
	}],
	date: {
		type: Date,
		default: Date.now()
	}
});

module.exports = Note = mongoose.model('notes', NoteSchema);
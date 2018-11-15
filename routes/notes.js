// NOTES ROUTES
const express	= require('express');
const router	= express.Router();
const passport	= require('passport'); // we need to use passport for creating protective route

// LOAD NOTE & USER MODEL
const Note = require('../models/Note');
const User = require('../models/User');

// POST NOTE REGISTRATION ROUTE -- PRIVATE
// creation of note, sending post request
router.post('/notes', passport.authenticate('jwt', { session: false }), (req, res) => {
	const newNote = new Note({
		title: req.body.title,
		text: req.body.text,
		user: req.user.id
	});

	newNote.save()
	.then(note => res.json(note))
	.catch(err => console.log(err));

	User.findOne({ _id: req.user.id })
	.populate('notes')
	.exec(function(err, user) {
		if (err) return handleError(err);
		user.notes.push(newNote);
		user.save();
	});
})

module.exports = router;
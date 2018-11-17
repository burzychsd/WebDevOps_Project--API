// NOTES ROUTES
const express	= require('express');
const router	= express.Router();
const passport	= require('passport'); // we need to use passport for creating protective route

// LOAD NOTE & USER & PERSON MODEL
const Note = require('../models/Note');
const User = require('../models/User');
const Person = require('../models/Person');

// POST NOTE REGISTRATION ROUTE -- PRIVATE
// creation of note, sending post request
router.post('/notes', passport.authenticate('jwt', { session: false }), (req, res) => {

	const newNote = new Note({
		title: req.body.title,
		text: req.body.text,
		alarm: new Date(req.body.alarm).toISOString().slice(0, -1),
		color: req.body.color,
		user: req.user.id
	});

	newNote.save();

	const obj = {}
	let arrOfPersons = [];

	const names = req.body.name;
	const emails = req.body.email;

	names.forEach((el, i) => obj[el] = { name: el, email: emails[i] });

	for(person in obj) {
		const newPerson = new Person({
			name: obj[person]["name"],
			email: obj[person]["email"]
		});

		newPerson.save();
		arrOfPersons.push(newPerson);
	}

	User.findOne({ _id: req.user.id })
	.populate('notes')
	.exec(function(err, user) {
		if (err) return handleError(err);
		user.notes.push(newNote);
		user.save();
		Note.findOne({ _id: user.notes.slice(-1).pop()._id })
		.populate('persons')
		.exec(function(err, note) {
			if (err) return handleError(err);
			note.persons = arrOfPersons;
			note.save()
			.then(note => res.json(note))
			.catch(err => console.log(err));
		});
	});

})

module.exports = router;
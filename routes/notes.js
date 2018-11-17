// NOTES ROUTES
const express	= require('express');
const router	= express.Router();
const passport	= require('passport'); // we need to use passport for creating protective route

// LOAD NOTE & USER & PERSON MODEL
const Note = require('../models/Note');
const User = require('../models/User');
const Person = require('../models/Person');

// GET ALL USER NOTES -- PRIVATE
// for fetching all notes from db
router.get('/notes', passport.authenticate('jwt', { session: false }), (req, res) => {
	Note.find({ user: req.user.id })
	.sort({ date: -1 })
	.then(notes => {
		if(notes.length === 0) {
			return res.status(404).json({ notes: 'No notes found' });
		}
		res.json(notes);

	})
	.catch(err => res.status(404).json({ notes: 'No notes found' }));
});

// GET SPECIFIC NOTE -- PRIVATE
// for fetching specific note from db
router.get('/notes/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Note.findById(req.params.id)
	.then(note => {
		if(!note) {
			return res.status(404).json({ note: 'There is no note with this ID' });
		}
		res.json(note);

	})
	.catch(err => res.status(404).json({ note: 'There is no note with this ID' }));
});

// POST NOTE ROUTE -- PRIVATE
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
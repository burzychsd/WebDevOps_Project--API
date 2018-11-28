// GETTING ALL NOTES
exports.get_all_notes = function(req, res) {
	Note.find({ user: req.user.id, archive: false, delete: false }).sort({ date: 'desc' }).then(notes => {
		if(notes.length === 0) {
			return res.status(404).json({ notes: 'No notes found' });
		}
		res.json(notes);
	}).catch(err => res.status(404).json({ notes: 'No notes found' }));
};

// GETTING SPECIFIC NOTE
exports.get_specific_note = function(req, res) {
	Note.findById(req.params.id).then(note => {
		if(!note) {
			return res.status(404).json({ note: 'There is no note with this ID' });
		}
		res.json(note);
	}).catch(err => res.status(404).json({ note: 'There is no note with this ID' }));
};

// GETTING NOTES FOR ARCHIVE
exports.get_archive_notes = function(req, res) {
	Note.find({ user: req.user.id, archive: true }).then(notes => {
		if(notes.length === 0) {
			return res.status(404).json({ notes: 'No notes found' });
		}
		res.json(notes);
	}).catch(err => res.status(404).json({ notes: 'No notes found' }));
}

// GETTING NOTES FOR DELETE
exports.get_delete_notes = function(req, res) {
	Note.find({ user: req.user.id, delete: true }).then(notes => {
		if(notes.length === 0) {
			return res.status(404).json({ notes: 'No notes found' });
		}
		res.json(notes);
	}).catch(err => res.status(404).json({ notes: 'No notes found' }));
}

// POSTING NOTE 
//LOAD PERSON CONTROLLER & MOMENT PACKAGE
const PersonController 	= require('./PersonController');
const moment 			= require('moment'); // for alarm data / docs: http://momentjs.com/docs/#/displaying/as-iso-string/

exports.post_note = function(req, res) {
	let { title, text, alarm, color, name, email } = req.body;
	let arrOfPersons = [];
	alarm ? alarm = moment(alarm).toISOString(true) : null;

	const newNote = new Note({
		user: req.user.id,
		title,
		text,
		alarm,
		color
	});
	newNote.save();

	PersonController.create_person(JSON.parse(name), JSON.parse(email), arrOfPersons, PersonController.check_if_person_exists);

	User.findOne({ _id: req.user.id }).populate('notes').exec(function(err, user) {
		if (err) return handleError(err);
		user.notes.push(newNote);
		user.save();
		Note.findOne({ _id: user.notes.slice(-1).pop()._id }).populate('persons').exec(function(err, note) {
			if (err) return handleError(err);
			note.persons = arrOfPersons;
			note.save()
			.then(note => res.json(note))
			.catch(err => console.log(err));
		});
	});
}

// UPDATING NOTE (ARCHIVE)
exports.update_note_archive = function(req, res) {
	const { archive } = req.body;

	console.log(archive)

	Note.findById({ _id: req.params.id, user: req.user.id }, function(err, note) {
		if (err) return handleError(err);

		note.archive = Boolean(archive);
		note.save(function(err, updatedNote) {
			if (err) return handleError(err);
			res.status(200).json({ msg: 'Note moved to Archive' });
		});
	});
}

// UPDATING NOTE (DELETE)
exports.update_note_delete = function(req, res) {
	const { deleted } = req.body;

	if (deleted) {
		Note.findById({ _id: req.params.id, user: req.user.id }, function(err, note) {
			if (err) return handleError(err);

			note.delete = deleted;
			note.save(function(err, updatedNote) {
				if (err) return handleError(err);
				res.json(res.status(200).json({ msg: 'Note moved to Bin' }));
			});
		});
	} else {
		res.status(400).json({ msg: 'Something went wrong. Try again.' });
	}
}

// DELETING NOTE
exports.delete_note = function(req, res) {
	Note.findOneAndDelete({ _id: req.params.id, user: req.user.id })
	.then(note => {
		if(note) {
			User.findById({ _id: req.user.id }, function(err, user) {
				if (err) return handleError(err);
				user.notes.splice(user.notes.indexOf(note._id));
				user.save();
			});
			res.status(200).json({ msg: 'Deleted' })
		} else {
			res.status(404).json({ note: 'There is no note with this ID' })
		}
	}).catch(err => console.log(err));
}
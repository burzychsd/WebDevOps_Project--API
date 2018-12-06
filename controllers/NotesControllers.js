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

// GETTING NOTES FOR REMINDERS
exports.get_reminders_notes = function(req, res) {
	Note.find({ user: req.user.id, alarm: { $type: 9 } }).then(notes => {
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

	PersonController.create_person(req.user.id, JSON.parse(name), JSON.parse(email), arrOfPersons, PersonController.check_if_person_exists);

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

// UPDATING NOTE
exports.update_note = function(req, res) {
	const { title, text, color, updatedNames, updatedEmails, newNames, newEmails, keys } = req.body;
	let { alarm } = req.body;
	alarm ? alarm = moment(alarm).toISOString(true) : null;
	let arrOfPersons = [];

	if(newNames && newEmails) {
		PersonController.create_person(req.user.id, 
			JSON.parse(newNames), JSON.parse(newEmails), 
			arrOfPersons, PersonController.check_if_person_exists);
	}

	Note.findById({ _id: req.params.id, user: req.user.id }).exec(function(err, note) {
		if(err) return handleError(err);
		note.title = title;
		note.text = text;
		note.alarm = alarm;
		note.color = color;

		if(updatedNames && updatedEmails) {
			JSON.parse(keys).forEach(key => {
				const regex = new RegExp(/\d+/);
				const index = Number(regex.exec(key)[0]);
				Person.findById({ _id: note.persons[index] }, function(err, person) {
					if(err) return handleError(err);
					person.name = JSON.parse(updatedNames)[index];
					person.email = JSON.parse(updatedEmails)[index];
					person.save();
				});
			});
		}

		if(newNames && newEmails) {
			note.persons = [...note.persons, ...arrOfPersons];
		}

		note.save(function(err, updatedNote) {
			if (err) return handleError(err);
			res.status(200).json({ msg: 'Note has been updated' });
		});
	});
}

// UPDATING NOTE (ARCHIVE & DELETE & REMINDERS)
exports.update_note_archive_delete_reminders = function(req, res) {
	const { archive, deleted, alarm } = req.body;
	
	Note.findById({ _id: req.params.id, user: req.user.id }, function(err, note) {
		if (err) return handleError(err);
		
		if (archive) {
			note.archive = archive;
		}

		if (deleted) {
			note.delete = deleted;
		}

		if (alarm === '') {
			note.alarm = alarm;
		}

		note.save(function(err, updatedNote) {
			if (err) return handleError(err);
			res.status(200).json({ msg: `${archive ? 'Note moved to Archive' : 
				alarm ? 'Alarm has been cancelled' : 'Note moved to Bin'}` });
		});
	});
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
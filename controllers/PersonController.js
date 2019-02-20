// LOAD PERSON MODEL
const Person 	= require('../models/Person');

// GET ALL PERSONS
exports.get_all_persons = function(req, res) {
	Person.find({ user: req.user.id }).then(persons => {
		if(persons.length === 0) {
			return res.status(404).json({ persons: 'No persons found' });
		}
		res.json(persons);
	}).catch(err => res.status(404).json({ persons: 'No persons found' }));
}

// CREATING PERSON 
exports.create_person = function(userId, name, email, arrOfPersons, checkIfExist) {
	const obj = {}
	let newPerson;

	if (name && email) {

		name.forEach((el, i) => obj[el] = { name: el, email: email[i] });

		for(person in obj) {
			newPerson = new Person({
				user: userId,
				name: obj[person]["name"],
				email: obj[person]["email"]
			});
			checkIfExist(obj, arrOfPersons, newPerson);
		}
	}
};

//CHECKING IF PERSON EXISTS
exports.check_if_person_exists = function(obj, arrOfPersons, newPerson) {
	Person.findOne({ email: obj[person]["email"] }).exec(function(err, person) {
		if (err) return handleError(err);
		if (person) {
			arrOfPersons.push(person._id);
		} else {
			newPerson.save();
			arrOfPersons.push(newPerson._id);
		}
	});
};
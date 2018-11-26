// CREATING PERSON 
exports.create_person = function(name, email, arrOfPersons, checkIfExist) {
	const obj = {}

	if (name && email) {

		name.forEach((el, i) => obj[el] = { name: el, email: email[i] });

		for(person in obj) {
			const newPerson = new Person({
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
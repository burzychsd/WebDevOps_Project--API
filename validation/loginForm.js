// Validator NPM Package see docs: https://github.com/chriso/validator.js/
const validator = require('validator');
const isEmpty 	= require('./isEmpty');

module.exports = function validateLoginInput(input) {
	// Messages if error occurs
	let errorsMsgs = {};

	const fields = ['email', 'password'];

	// Making sure, that we're passing empty string if the field is empty
	fields.forEach((field) => {
		input[field] = !isEmpty(input[field]) ? input[field] : '';
	});

	// Chech if isEmpty
	fields.forEach((field) => {
		if(validator.isEmpty(input[field])) {
			errorsMsgs[field] = field.charAt(0).toUpperCase() + field.substring(1, ) + ' field is required';
		}
	});

	// Check if email is valid
	if(!validator.isEmail(input.email)) {
		errorsMsgs.email = 'Email must be valid';
	}

	// we wanna check if isValid is empty or not, we cant use validator method 'isEmpty'
	// because errorsMessages isn't string - so we gonna create own function 'isEmpty'

	return {
		errorsMsgs,
		isValid: isEmpty(errorsMsgs)
	}
}
// Validator NPM Package see docs: https://github.com/chriso/validator.js/
const validator = require('validator');
const isEmpty 	= require('./isEmpty');

module.exports = function validateRegisterInput(input) {
	// Messages if error occurs
	let errorsMsgs = {};

	const fields = ['username', 'email', 'password', 'password2']; // password2 is just the confirmation of the first password
	const fields2 = ['username', 'password'];

	// Making sure, that we're passing empty string if the field is empty
	fields.forEach((field) => {
		input[field] = !isEmpty(input[field]) ? input[field] : '';
	});

	// Chech if isEmpty
	fields.forEach((field) => {
		if(validator.isEmpty(input[field])) {
			errorsMsgs[field] = field !== 'password2' ? 
			field.charAt(0).toUpperCase() + field.substring(1, ) + ' field is required' : 
			'Confirm Password'
		}
	});

	// Check if matches
	fields2.forEach((field) => {
		if(!validator.matches(input[field], /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/)) {
			input[field] !== '' ? errorsMsgs[field] = field.charAt(0).toUpperCase() + field.substring(1, ) + 
			' must be at least one number, one letter, and be between 6-15 character in length' : null
		}
	});

	// Check if email is valid
	if(!validator.isEmail(input.email)) {
		errorsMsgs.email = 'Email must be valid';
	}

	// Check if password equals password2
	if(!validator.equals(input.password, input.password2)) {
		errorsMsgs.password2 = 'Passwords must match';
	}

	// we wanna check if isValid is empty or not, we cant use validator method 'isEmpty'
	// because errorsMessages isn't string - so we gonna create own function 'isEmpty'

	return {
		errorsMsgs,
		isValid: isEmpty(errorsMsgs)
	}
}
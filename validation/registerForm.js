// Validator NPM Package see docs: https://github.com/chriso/validator.js/
const validator = require('validator');
const isEmpty 	= require('./isEmpty');

module.exports = function validateRegisterInput(input) {
	// Messages if error occurs
	let errorsMsgs = {};

	if(!validator.matches(input.username, /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/)) {
		errorsMsgs.username = 'Username must be at least one number, one letter, and be between 6-15 character in length';
	}

	if(validator.isEmpty(input.username)) {
		errorsMsgs.username = 'Username can\'t be empty';
	}

	if(!validator.isEmail(input.email)) {
		errorsMsgs.email = 'Your email is incorrect, try again';
	}

	if(validator.isEmpty(input.email)) {
		errorsMsgs.email = 'Please, enter your valid email';
	}

	if(!validator.matches(input.password, /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/)) {
		errorsMsgs.password = 'Username must be at least one number, one letter, and be between 6-15 character in length';
	}

	// we wanna check if isValid is empty or not, we cant use validator method 'isEmpty'
	// because errorsMessages isn't string - so we gonna create own function 'isEmpty'

	return {
		errorsMsgs,
		isValid: isEmpty(errorsMsgs)
	}
}
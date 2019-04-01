const mongoose = require('mongoose');
const validator = require('validator');

const EmployerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, // trim whitespace
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: 'Not valid email'
		}
	},
	location: {
		type: String,
		required: true,
		trim: true
	},
	phone: {
		type: String,
		required: true,
		validate: {
			validator: validator.isMobilePhone,
			message: 'Not valid phone number'
		}
	},
	facebook: {
		type: String,
		required: false
	},
	instagram: {
		type: String,
		required: false
	},
	twitter: {
		type: String,
		required: false
	},
	linkedin: {
		type: String,
		required: false
	},
	desc: {
		type: String,
		required: true
	},
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
		required: true
	}
});

const Employer = mongoose.model('Employer', EmployerSchema)

module.exports = {Employer}
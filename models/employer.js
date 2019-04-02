const mongoose = require('mongoose');
const validator = require('validator');

const EmployerSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
		required: true
	}
});

const Employer = mongoose.model('Employer', EmployerSchema)

module.exports = {Employer}
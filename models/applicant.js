const mongoose = require('mongoose');
const validator = require('validator');

const ApplicantSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
		required: true
	}
});

const Applicant = mongoose.model('Applicant', ApplicantSchema)

module.exports = {Applicant}
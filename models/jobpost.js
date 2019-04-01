const mongoose = require('mongoose');
const validator = require('validator');

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	salary: {
		type: Number,
		required: true,
		validate: {
			validator: validator.isNumeric,
			message: "Invalid salary"
		}
	},
	location: {
		type: String,
		required: true,
		trim: true
	},
	category: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true,
		validate: {
			validator: validator.isFQDN,
			message: 'Not valid application url'
		}
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

const JobPost = mongoose.model('JobPost', PostSchema)

module.exports = {JobPost}
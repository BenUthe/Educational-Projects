/* Users model */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// We'll make this model in a different way
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Username required."],
		minlength: 1,
		trim: true, // trim whitespace
		unique: true,
		validate: {
			validator: validator.isAlphanumeric,
			message: 'Invalid username.'
		}
	},
	password: {
		type: String,
		required: [true, "Password required."],
		minlength: 4
	},
	utype: {
		type: String,
		required: [true, "User type required."],
		trim: true
	},
	profile: {
		name: {
			type: String,
			required: [true, "Name required."],
			minlength: 1,
			trim: true
		},
		email: {
			type: String,
			required: [true, "Email required."],
			minlength: 1,
			trim: true, // trim whitespace
			unique: true,
			validate: {
				validator: validator.isEmail,
				message: 'Invalid email.'
			}
		},
		location: {
			type: String,
			required: [true, "Location required."],
			trim: true
		},
		phone: {
			type: String,
			required: [true, "Phone # required."],
			trim: true,
			validate: {
				validator: validator.isMobilePhone,
				message: 'Not valid phone number.'
			}
		},
		facebook: {
			type: String,
			required: false,
			validate: {
				validator: x => x === "" || validator.isFQDN(x),
				message: 'Invalid URL for facebook.'
			}
		},
		instagram: {
			type: String,
			required: false,
			validate: {
				validator: x => x === "" || validator.isFQDN(x),
				message: 'Invalid URL for instagram.'
			}
		},
		twitter: {
			type: String,
			required: false,
			validate: {
				validator: x => x === "" || validator.isFQDN(x),
				message: 'Invalid URL for twitter.'
			}
		},
		linkedin: {
			type: String,
			required: false,
			validate: {
				validator: x => x === "" || validator.isFQDN(x),
				message: 'Invalid URL for linkedin.'
			}
		},
		about: {
			type: String,
			required: false
		},		
		picture: {
			type: String,
			required: false
		},	
		resume: {
			type: String,
			required: false
		}
	}
})

// Our own student finding function
UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this

	return User.findOne({username: username}).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next();
	}

})


const User = mongoose.model('User', UserSchema)

module.exports = { User }
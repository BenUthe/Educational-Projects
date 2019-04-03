/* CSC309 - user and resource authentication */

'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const hbs = require('hbs')

const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./db/mongoose');

// Import the models
const { User } = require('./models/user')
const { Employer } = require('./models/employer')
const { Applicant } = require('./models/applicant')
const { JobPost } = require('./models/jobpost')



// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))

// set the view library
app.set('view engine', 'hbs')

// static js directory
app.use("/js", express.static(__dirname + '/public/js'))
app.use("/css", express.static(__dirname + '/public/css'))

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 5 * 3600 * 1000,
		httpOnly: true
	}
}))

// Add middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		res.redirect('dashboard')
	} else {
		next();
	}
}

app.get('/', (req, res) => {
	//res.sendFile(__dirname + '/public/index.html')
	res.render('index.hbs', {
		loggedin: req.session.user,
		name: req.session.user && req.session.name
	})
})

app.get('/dashboard', (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		//res.sendFile(__dirname + '/public/dashboard.html')
		if(req.session.utype === "Employer") {
			//res.sendFile(__dirname + '/public/employer_profile.html')
			res.render('employer.hbs', {
				loggedin: true,
				owner: true,
				name: req.session.name,
				employerID: req.session.user,
				whoami: req.session.user
			})
		} else if(req.session.utype === "Applicant") {
			res.render('user.hbs', {
				loggedin: true,
				owner: true,
				name: req.session.name,
				userID: req.session.user,
				whoami: req.session.user
			})
			//res.sendFile(__dirname + '/public/user_profile.html')
		} else {
			res.sendFile(__dirname + '/public/admin.html')
		}
	} else {
		res.redirect('/')
	}
})

// User login and logout routes

app.post('/users/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	User.findByUsernamePassword(username, password).then((user) => {
		if(!user) {
			res.status(400).send({error: "Invalid username/password."});
		} else {
			// Add the user to the session cookie that we will
			// send to the client
			req.session.user = user._id;
			req.session.utype = user.utype;
			req.session.name = user.profile.name;
			res.send({redirect: '/dashboard'})
		}
	}).catch((error) => {
		res.status(400).send({error: "Invalid username/password."});
	})
})

app.get('/users/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})


// Middleware for authentication for resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.redirect('/')
		})
	} else {
		res.redirect('/')
	}
}

/// Student routes go below

// Set up a POST route to create a student
/*app.post('/students', authenticate, (req, res) => {
	log(req.body)

	// Create a new student
	const student = new Student({
		name: req.body.name,
		year: req.body.year,
		creator: req.user._id // from the authenticate middleware
	})

	// save student to database
	student.save().then((result) => {
		// Save and send object that was saved
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})

})

// GET all students
app.get('/students', authenticate, (req, res) => {
	Student.find({
		creator: req.user._id // from authenticate middleware
	}).then((students) => {
		res.send({ students }) // put in object in case we want to add other properties
	}, (error) => {
		res.status(500).send(error)
	})
})

// GET student by id
app.get('/students/:id', (req, res) => {
	const id = req.params.id // the id is in the req.params object

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	Student.findById(id).then((student) => {
		if (!student) {
			res.status(404).send()
		} else {
			res.send({ student })
		}

	}).catch((error) => {
		res.status(500).send(error)
	})
})

app.delete('/students/:id', (req, res) => {
	const id = req.params.id

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findByIdAndRemove
	Student.findByIdAndRemove(id).then((student) => {
		if (!student) {
			res.status(404).send()
		} else {
			res.send({ student })
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
})

app.patch('/students/:id', (req, res) => {
	const id = req.params.id

	// Get the new name and year from the request body
	const { name, year } = req.body
	const properties = { name, year }

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Update it
	// $new: true gives back the new document
	Student.findByIdAndUpdate(id, {$set: properties}, {new: true}).then((student) => {
		if (!student) {
			res.status(404).send()
		} else {
			res.send({ student })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})

})*/


/** User routes **/
// profile routes
app.get('/u/:uid', (req, res) => {
	const id = req.params.uid;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user || user.utype === "Admin") {
			res.status(404).send()
		} else if(user.utype === "Employer") {
			res.render('employer.hbs', {
				loggedin: req.session.user,
				owner: req.session.user && user._id.equals(req.session.user),
				name: req.session.name,
				employerID: user._id,
				whoami: req.session.user
			})
		} else {
			res.render('user.hbs', {
				loggedin: req.session.user,
				owner: req.session.user && user._id.equals(req.session.user),
				name: req.session.name,
				userID: user._id,
				whoami: req.session.user
			})
		}

	}).catch((error) => {
		console.log(error)
		res.status(500).send(sanitizeMongoError(error))
	})
})

app.get('/applicants', authenticate, (req, res) => {
	if(req.session.utype !== "Admin") {
		res.status(400).send({error: "Not privileged."});
	}
	User.find({utype: "Applicant"}).then((docs) => {
		res.send(docs);
	}).catch((error) => {
		res.status(400).send(sanitizeMongoError(error));
	})
})

app.delete('/users/:id', authenticate, (req, res) => {
	if(req.session.utype !== "Admin") {
		res.status(400).send({error: "Not privileged."});
	}

	const id = req.params.id

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findByIdAndRemove
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		}  else {
			user.remove();
			res.send({ user })
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
})

app.get('/employers', authenticate, (req, res) => {
	if(req.session.utype !== "Admin") {
		res.status(400).send({error: "Not privileged."});
	}
	User.find({utype: "Employer"}).then((docs) => {
		res.send(docs);
	}).catch((error) => {
		res.status(400).send(sanitizeMongoError(error));
	})
})

app.post('/users', (req, res) => {

	// Create a new user
	const user = new User({
		username: req.body.username,
		password: req.body.password,
		utype: req.body.utype,
		profile: {
			name: req.body.name,
			email: req.body.email,
			location: req.body.location,
			phone: req.body.phone
		}
	})

	// save user to database
	user.save().then((result) => {
		req.session.user = result._id;
		req.session.utype = result.utype;
		req.session.name = result.profile.name;
		res.send({redirect: "/dashboard"});
	}, (error) => {
		res.status(400).send(sanitizeMongoError(error));
	})

})

// profile routes
app.get('/profile/:id', (req, res) => {
	const id = req.params.id // the id is in the req.params object

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user.profile)
		}

	}).catch((error) => {
		res.status(500).send(sanitizeMongoError(error))
	})
})

app.patch('/profile', authenticate, (req, res) => {
	const id = req.user._id;

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send();
			return;
		}
		const profile = user.profile;
		if(!user.profile) {
			res.status(404).send();
			return;
		}
		user.profile = req.body;
		user.save().then((result) => {
			res.send(result.profile);
		}, (error) => {
			res.status(400).send(sanitizeMongoError(error));
		})
	}).catch((error) => {
		res.status(500).send(sanitizeMongoError(error));
	})
})

// post routes
app.post('/post', authenticate, (req, res) => {
	// Create a new job post
	const post = new JobPost({
		title: req.body.title,
		salary: req.body.salary,
		province: req.body.province,
		city: req.body.city,
		category: req.body.category,
		desc: req.body.desc,
		url: req.body.url,
		creator: req.user._id // from the authenticate middleware
	})

	if(isNaN(parseFloat(post.salary)) || !isFinite(post.salary)) {
		res.status(400).send({error: "Invalid salary."});
		return;
	}

	// save post to database
	post.save().then((result) => {
		// Save and send object that was saved
		res.send(result);
	}, (error) => {
		res.status(400).send(sanitizeMongoError(error));
	})

})

app.delete('/post/:id', authenticate, (req, res) => {
	const id = req.params.id

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findByIdAndRemove
	JobPost.findById(id).then((post) => {
		if (!post) {
			res.status(404).send()
		} else if(req.session.utype !== "Admin" && !post.creator.equals(req.session.user)) {
			res.status(400).send();
		} else {
			post.remove();
			res.send({ post })
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
})

app.get('/posts', (req, res) => {
	JobPost.find({}).then((docs) => {
		res.send(docs);
	}).catch((error) => {
		res.status(400).send(sanitizeMongoError(error));
	})
})

app.get('/posts/:cid', (req, res) => {
	const id = req.params.cid // the id is in the req.params object

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	JobPost.find({creator: id}).then((docs) => {
		res.send(docs);
	}).catch((error) => {
		res.status(400).send(sanitizeMongoError(error));
	})
})

app.delete('/posts/:cid', authenticate, (req, res) => {
	if(req.session.utype !== "Admin") {
		res.status(400).send();
	}
	const id = req.params.cid

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findByIdAndRemove
	JobPost.find({creator: id}).then((posts) => {
		posts.forEach(p => p.remove());
		res.send(posts)
	}).catch((error) => {
		res.status(500).send(error)
	})
})

function sanitizeMongoError(error) {
	if(error.code === 11000) {
		console.log(error.errmsg);
		const [_, field] = error.errmsg.match(/index:\s(?:[a-zA-Z]+\.)*([A-Za-z]+).* dup key/i);
		return {error: `${field.charAt(0).toUpperCase() + field.slice(1)} in use.`};
	} else if(error.message.includes(" validation failed: ")) {
		const [_, message] = error.message.match(/.+ validation failed\: .+\: (.*)$/i);
		return {error: message};
	} else {
		console.log(error);
		return {error: "Something went wrong."};
	}
}

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});



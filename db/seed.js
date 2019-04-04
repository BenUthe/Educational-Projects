/**
 * Seed the database
 */
 
// Import models
// Import the models
const { User } = require('../models/user')
const { Employer } = require('../models/employer')
const { Applicant } = require('../models/applicant')
const { JobPost } = require('../models/jobpost')

function seedDB() {
	/** Clear Models */
	Employer.remove({}, function(err) { 
	   console.log('Employers cleared') 
	});
	User.remove({}, function(err) { 
	   console.log('Users cleared') 
	});
	JobPost.remove({}, function(err) { 
	   console.log('Jobs cleared') 
	});
	/** USERS **/
	// Create some users
	const _user1 = {
		username: 'user1',
		password: 'user1',
		utype: 'Employer',
		profile: {
			name: 'Company 1',
			email: 'mail@company1.com',
			location: '55 Bloor St. W, Toronto, ON',
			phone: '1234445555'
		}
	}
	const _user2 = {
		username: 'user2',
		password: 'user2',
		utype: 'Employer',
		profile: {
			name: 'Company 2',
			email: 'mail@company2.com',
			location: '200 Spadina Ave, Calgary, Alberta',
			phone: '6667778888'
		}
	}
	
	// insert into the db
	const user1 = new User(_user1), 
		  user2 = new User(_user2);
		  
	user1.save();
	user2.save();
	
	/** EMPLOYERS **/
	// create some employers
	const employer1 = new Employer({userid : user1}), 
		  employer2 = new Employer({userid : user2});
	
	employer1.save();
	employer2.save();
	
	
	/** JOBS **/
	// create some jobs
	const jobs = [
		{ 
			title: "Job 1",
			salary: 60000,
			city: "Toronto",
			province: "Ontario",
			category: "Part-Time",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel nibh dictum, " +
				"feugiat nulla ut, feugiat nibh. Integer a scelerisque mauris, quis consequat " +
				"Nam et enim id velit maximus rutrum. Fusce nec arcu maximus, consequat risu. " +
				"Quisque sit amet pellentesque est. Fusce tempus consequat scelerisque. " +
				"Nunc vel convallis tortor. Phasellus ac condimentum eros. " +
				"In hac habitasse platea dictumst. Vestibulum at semper dolor. " +
				"Suspendisse facilisis mollis pellentesque. Nam condimentum varius nunc, " +
				"ut maximus metus molestie eget. Orci varius natoque penatibus et magnis dis " +
				"parturient montes, nascetur ridiculus mus. Morbi luctus orci a aliquet malesuada. " +
				"Suspendisse vitae aliquet lectus.",
			creator: user1
		},
		{ 
			title: "Job 2",
			salary: 20000,
			city: "Vancouver",
			province: "British Columbia",
			category: "Contract",
			desc: "Nunc nibh sem, gravida sit amet metus egestas, condimentum consectetur erat. Etiam " +
				"sed ante vitae neque gravida euismod. Proin ultricies tincidunt tortor, et molestie " +
				"eros interdum in. Suspendisse sagittis iaculis elit ut sodales. Curabitur interdum " +
				"libero in arcu fringilla bibendum. Fusce rhoncus nulla eget justo facilisis, ut " +
				"pulvinar ex volutpat. Morbi accumsan auctor tellus eget ullamcorper.",
			creator: user2
		},
		{ 
			title: "Job 3",
			salary: 90000,
			city: "Halifax",
			province: "Nova Scotia",
			category: "Full-Time",
			desc: "Proin tempor enim quis metus eleifend, id suscipit felis semper. In hac habitasse " +
				"platea dictumst. Morbi euismod gravida rhoncus. Etiam elementum venenatis dictum. " +
				"Praesent tellus nisl, feugiat ac accumsan a, imperdiet molestie metus. Proin " +
				"vitae sodales velit. Ut efficitur euismod tortor, nec congue odio vehicula eget. " +
				"Aenean sit amet auctor ante. Nunc aliquam turpis at volutpat accumsan. Nulla " +
				"placerat quis arcu in hendrerit. Aliquam dolor nisl, posuere nec varius et, " +
				"molestie in turpis. Aliquam id justo facilisis, finibus quam non, blandit felis. " +
				"Quisque blandit metus sed arcu cursus consequat at eu elit. Nunc tincidunt elit " +
				"a libero faucibus aliquet.",
			creator: user2
		}
	];

	// use the Job Post model to insert/save
	for (job of jobs) {
		let newJob = new JobPost(job);
		newJob.save();
	}

	// seeded!
	console.log('Database seeded!');
	
	return true
}

module.exports = {seedDB}
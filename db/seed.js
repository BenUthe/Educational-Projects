/**
 * Seed the database
 */

// Import models
// Import the models
const { User } = require('../models/user')
const { JobPost } = require('../models/jobpost')

function seedDB() {
	/** Clear Models */
	User.remove({}, function(err) {
	   console.log('Users cleared')
	});
	JobPost.remove({}, function(err) {
	   console.log('Jobs cleared')
	});
	/** USERS **/
	// Create some users
	const _user = {
		username: 'user',
		password: 'user',
		utype: 'Applicant',
		profile: {
			name: 'Applicant a',
			email: 'mail@applicanta.com',
			location: '84 Calderston, Brampton, ON',
			phone: '1448889797'
		}
	}
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

	const _admin = {
		username: 'admin',
		password: 'admin',
		utype: 'Admin',
		profile: {
			name: 'Admin',
			email: 'admin@mail.com',
			location: 'AdminLand, AdminWorld',
			phone: '666911100'
		}
	}

	// insert into the db
	const user = new User(_user),
		  user1 = new User(_user1),
		  user2 = new User(_user2),
		  admin = new User(_admin);
	user.save();
	user1.save();
	user2.save();
	admin.save();

	/** JOBS **/
	// create some jobs
	const jobs = [
		{
			title: "Software Engineer",
			salary: 60000,
			city: "Toronto",
			province: "Ontario",
			category: "Part-Time",
			desc: "Company 1's software engineers develop the next-generation technologies that change " +
				"how billions of users connect, explore, and interact with information and one " +
				"another. Our products need to handle information at massive scale, and extend well " +
				"beyond web search. We're looking for engineers who bring fresh ideas from all " +
				"areas, including information retrieval, distributed computing, large-scale system " +
				"design, networking and data storage, security, artificial intelligence, " +
				"natural language processing, UI design and mobile; the list goes on and is growing " +
				"every day. As a software engineer, you will work on a specific project " +
				"critical to Company 1’s needs with opportunities to switch teams and projects as you " +
				"and our fast-paced business grow and evolve. We need our engineers to be " +
				"versatile, display leadership qualities and be enthusiastic to take on new problems " +
				"across the full-stack as we continue to push technology forward.",
			url: "careers.google.com",
			creator: user1
		},
		{
			title: "Business Partner Development Leader",
			salary: 20000,
			city: "Vancouver",
			province: "British Columbia",
			category: "Contract",
			desc: "The Role: SI/ ISV Partner Business Development Executive: In our first year, we " +
				"primarily worked with management and strategy consulting partners. Going " +
				"forward, one of our most important growth pillars will be to scale our solution " +
				"to System Integrators and ISVs that have a track record of innovation, " +
				"analytical capabilities, and market development. We will do this by recruiting " +
				"the right partner set and by driving joint solution and market development " +
				"programs with SIs and ISVs. This role will be responsible for refining our SI/ " +
				"ISV strategy, executing initial incubation programs with hand-selected partners, " +
				"and then developing and executing a scale motion that will include Comapny 2’s " +
				"key partners and partner management organization. A deep knowledge of the SI and " +
				"ISV landscape is critical as is experience in developing successful partner " +
				"solutions, joint market and client success, and experience in scaling those " +
				"solutions beyond initial programs.",
			url: "careers.microsoft.com",
			creator: user2
		},
		{
			title: "Senior Communications Associate",
			salary: 90000,
			city: "Halifax",
			province: "Nova Scotia",
			category: "Full-Time",
			desc: "As a member of the Global Communications & Public Affairs team, you will work " +
				"cross-functionally to help communicate with journalists and other thought leaders; " +
				"devise specific communications materials and campaigns based on understanding " +
				"of journalists' interests; engage in face-to-face meetings with commentators and " +
				"other opinion formers; develop print and web-based material supporting these " +
				"campaigns; and counter misinformation that might interfere with our business and " +
				"ability to serve our users. We're looking for great communicators who can " +
				"understand complex issues and explain them in person and also via well written, simple " +
				"blog posts, FAQs, video scripts and more.",
			url: "youtube.com",
			creator: user1
		}
	];

	// use the Job Post model to insert/save
	for (job of jobs) {
		let newJob = new JobPost(job);
		newJob.save().catch((error) => console.log(error));
	}

	// seeded!
	console.log('Database seeded!');

	return true
}

module.exports = {seedDB}
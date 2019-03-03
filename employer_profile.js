"use strict";
class employerProfile {
	constructor(companyName, locate, email, facebook, instagram, twitter, about) {
		this.companyName = companyName;
		this.locate = locate;
		this.email = email;
		this.facebook = facebook;
		this.instagram = instagram;
		this.twitter = twitter;
		this.about = about;
	}
}

const employer = "Company 1";
let empJobPosts = [];
let empJobPostsDiv, empNumPostsSpan, empPostForm, companyInfo;

function initPage(e) {
	empJobPostsDiv = document.querySelector("#jobPostings");
	empNumPostsSpan = document.querySelector("#numPosts");
	empPostForm = document.forms["newJob"];

	empJobPostsDiv.addEventListener("click", jobsClickListener);

	empJobPosts = getCompanyJobPosts(employer);
	empJobPosts.forEach(job => renderJobPost(job, empJobPostsDiv, true));
	
	companyInfo = getCompanyProfile();
	fillPage(companyInfo);

	renderNumPosts();

	empPostForm.addEventListener("submit", createPost);
}

window.addEventListener("load", initPage);

function createPost(e) {
	e.preventDefault();

	// TODO: more rigorous validation
	// TODO: refactor this elsewhere
	// (probably to server side, as client side JS can be bypassed)
	let salary, city, province;
	try {
		let salaryStr = empPostForm.elements["newJobSalary"].value;
		salaryStr = salaryStr.replace(/[^\d\.\-]/g, "");
		salary = parseInt(salaryStr);
		if(salary < 0 || isNaN(salary) || !isFinite(salary))
			throw "Negative Salary forbidden";
	} catch {
		renderEmpFormErr("Please enter a valid salary.");
		return;
	}

	try {
		const locArr = empPostForm.elements["newJobLocation"].value.trim().split(",");
		if(locArr.length !== 2 || !locArr[1].trim())
			throw "Invalid location";

		city = locArr[0].trim();
		province = locArr[1].trim();
	} catch {
		renderEmpFormErr("Please enter a valid location (city, province)");
		return;
	}

	const jobPost = new JobPost(empPostForm.elements["newJobTitle"].value,
								employer, salary,
						  		empPostForm.elements["newJobCategory"].value,
						  		city, province,
						  		empPostForm.elements["newJobDescription"].value);

	if(!createJobPost(jobPost)) {
		renderEmpFormErr("ERROR: storing new job post failed.");
		return;
	}

	clearEmpForm();

	empJobPosts.push(jobPost);
	renderJobPost(jobPost, empJobPostsDiv);
	renderNumPosts();
}

function jobsClickListener(e) {
	if(e.target.classList.contains("delete"))
		deletePost(e);
}

function deletePost(e) {
	const postDiv = e.target.parentElement.parentElement.parentElement;
	const idx = Array.prototype.indexOf.call(empJobPostsDiv.children, postDiv);
	deleteJobPost(empJobPosts[idx].id);
	empJobPosts.splice(idx, 1);
	removePostDiv(postDiv);
}

/** DOM MANIPULATING FUNCTIONS */
function renderNumPosts() {
	empNumPostsSpan.innerText = empJobPosts.length;
}

function renderEmpFormErr(errText) {
	document.querySelector("#invalidPostSpan").innerText = errText;
}

function clearEmpForm() {
	empPostForm.elements["newJobTitle"].value = "";
	empPostForm.elements["newJobSalary"].value = "";
	empPostForm.elements["newJobLocation"].value = "";
	empPostForm.elements["newJobCategory"].value = undefined;
	empPostForm.elements["newJobDescription"].value = "";
	document.querySelector("#invalidPostSpan").innerText = "";
	$("#modalCreateJob").modal('hide');
}

function removePostDiv(postDiv) {
	empJobPostsDiv.removeChild(postDiv);
	renderNumPosts();
}

/** BACKEND INVOLVING FUNCTIONS */
function createJobPost(jobPost) {
	// Should send the new post entry to the server
	// so the server can store the entry in the db
	// code below requires server call
	return true;
}

function deleteJobPost(jobPostID) {
	// Should delete the given job post from db
	// code below requires server call
	return true;
}

function getCompanyProfile() {
	// Get job posts of company from server
	// code below requires server call
	// When we write backend code
	// pagination will be performed
	// so only a few posts wil be fetched.
	
	const employProfile = new employerProfile(
		"Company Name",
		"Toronto, ON",
		"email@company.com",
		"https://www.facebook.com",
		"https://www.instagram.com",
		"https://www.twitter.com",
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel nibh dictum, " +
		"feugiat nulla ut, feugiat nibh. Integer a scelerisque mauris, quis consequat " +
		"Nam et enim id velit maximus rutrum. Fusce nec arcu maximus, consequat risu. " +
		"Quisque sit amet pellentesque est. Fusce tempus consequat scelerisque. " +
		"Nunc vel convallis tortor. Phasellus ac condimentum eros. " +
		"In hac habitasse platea dictumst. Vestibulum at semper dolor. " +
		"Suspendisse facilisis mollis pellentesque. Nam condimentum varius nunc, " +
		"ut maximus metus molestie eget. Orci varius natoque penatibus et magnis dis " +
		"parturient montes, nascetur ridiculus mus. Morbi luctus orci a aliquet malesuada. " +
		"Suspendisse vitae aliquet lectus."
	);
	return employProfile;
}
function fillPage(employer){
	const name = document.getElementById("companyName");
	name.innerText = employer.companyName;
	const locate = document.getElementById("locate");
	locate.innerText = employer.locate;
	const email = document.getElementById("email");
	email.innerText = employer.email;
	const about = document.getElementById("aboutCompany");
	about.innerText = employer.about;
	const instagram = document.getElementById("instagram");
	instagram.href = employer.instagram;
	const twitter = document.getElementById("twitter");
	twitter.href = employer.twitter;
}
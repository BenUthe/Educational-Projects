"use strict";

class EmployerProfile {
	constructor(name, location, email, phone, facebook, instagram, twitter, linkedin, about) {
		this.name = name;
		this.location = location;
		this.email = email;
		this.phone = phone;
		this.facebook = facebook;
		this.instagram = instagram;
		this.twitter = twitter;
		this.linkedin = linkedin;
		this.about = about;
	}
}

let employer;
let empJobPosts = [];
let empJobPostsDiv, empNumPostsSpan, empPostForm;
let editProfileBtn, submitEdit;

function initPage(e) {
	empJobPostsDiv = document.querySelector("#jobPostings");
	empNumPostsSpan = document.querySelector("#numPosts");
	empPostForm = document.forms["newJob"];

	empJobPostsDiv.addEventListener("click", jobsClickListener);

	editProfileBtn = document.getElementById("editCompany");
	editProfileBtn.addEventListener("click", editProfileModalLoad);
	submitEdit = document.forms["editProfile"];
	submitEdit.addEventListener("submit", updateEmployerProfile);

	employer = getEmployerProfile();
	renderEmployerProfile(employer);

	empJobPosts = getCompanyJobPosts(employer.name);
	empJobPosts.forEach(job => renderJobPost(job, empJobPostsDiv, true));

	renderNumPosts();

	empPostForm.addEventListener("submit", createPost);
}

window.addEventListener("load", initPage);

function updateEmployerProfile(e){
	e.preventDefault();
	employer.name = document.querySelector("#newCompanyName").value;
	employer.location = document.querySelector("#newCompanyLocation").value;
	employer.email = document.querySelector("#newCompanyEmail").value;
	employer.phone = document.querySelector("#newCompanyPhone").value;
	employer.facebook = document.querySelector("#newCompanyFacebook").value;
	employer.instagram = document.querySelector("#newCompanyInstagram").value;
	employer.twitter = document.querySelector("#newCompanyTwitter").value;
	employer.linkedin = document.querySelector("#newCompanyLinkedin").value;
	employer.about = document.querySelector("#newCompanyAbout").value;

	modifyEmployerProfile(employer);

	renderEmployerProfile(employer);
	$("#modalEditProfile").modal('hide');
}

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
								employer.name, salary,
						  		empPostForm.elements["newJobCategory"].value,
						  		city, province,
						  		empPostForm.elements["newJobDescription"].value);

	if(!createJobPost(jobPost)) {
		renderEmpFormErr("ERROR: storing new job post failed.");
		return;
	}

	clearEmpForm();

	empJobPosts.push(jobPost);
	renderJobPost(jobPost, empJobPostsDiv, true);
	renderNumPosts();
}

function editProfileModalLoad(e) {
	e.preventDefault();

	fillInInfo(employer);
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
function renderEmployerProfile(employer){
	const name = document.getElementById("companyName");
	name.innerText = employer.name;
	const location = document.getElementById("companyLocation");
	location.innerText = employer.location;
	const email = document.getElementById("companyEmail");
	email.innerText = employer.email;
	const phone = document.getElementById("companyPhone");
	phone.innerText = employer.phone;
	const facebook = document.getElementById("companyFacebook");
	facebook.href = employer.facebook;
	const instagram = document.getElementById("companyInstagram");
	instagram.href = employer.instagram;
	const twitter = document.getElementById("companyTwitter");
	twitter.href = employer.twitter;
	const linkedin = document.getElementById("companyLinkedin");
	linkedin.href = employer.linkedin;
	const about = document.getElementById("companyAbout");
	about.innerText = employer.about;
}

function fillInInfo(employerInfo) {
	const name = document.getElementById("newCompanyName");
	name.value = employerInfo.name;
	const locate = document.getElementById("newCompanyLocation");
	locate.value = employerInfo.location;
	const email = document.getElementById("newCompanyEmail");
	email.value = employerInfo.email;
	const phone = document.getElementById("newCompanyPhone");
	phone.value = employerInfo.phone;
	const facebook = document.getElementById("newCompanyFacebook");
	facebook.value = employerInfo.facebook;
	const instagram = document.getElementById("newCompanyInstagram");
	instagram.value = employerInfo.instagram;
	const twitter = document.getElementById("newCompanyTwitter");
	twitter.value = employerInfo.twitter;
	const linkedin = document.getElementById("newCompanyLinkedin");
	linkedin.value = employerInfo.linkedin;
	const about = document.getElementById("newCompanyAbout");
	about.value = employerInfo.about;
}

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

function getEmployerProfile() {
	// Get company profile info from server
	// code below requires server call
	// Needs to take a session id or such
	// as input later on.

	const employerProfile = new EmployerProfile(
		"Company 1",
		"Toronto, ON",
		"email@company.com",
		"(905)-262-6667",
		"https://www.facebook.com",
		"https://www.instagram.com",
		"https://www.twitter.com",
		"https://www.linkedin.com",
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
	return employerProfile;
}

function modifyEmployerProfile(employer) {
	// Send updated profile info to server
	// code below requires server call
	return true;
}
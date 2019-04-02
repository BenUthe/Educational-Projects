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

let whoami;
let employerID, employer;
let empJobPosts = [];
let empJobPostsDiv, empNumPostsSpan, empPostForm;
let editProfileBtn, submitEdit;

async function initPage(e) {
	empJobPostsDiv = document.querySelector("#jobPostings");
	empNumPostsSpan = document.querySelector("#numPosts");
	empPostForm = document.forms["newJob"];

	empJobPostsDiv.addEventListener("click", jobsClickListener);

	editProfileBtn = document.getElementById("editCompany");
	if(editProfileBtn) editProfileBtn.addEventListener("click", editProfileModalLoad);
	submitEdit = document.forms["editProfile"];
	submitEdit.addEventListener("submit", updateEmployerProfile);

	whoami = document.getElementById("whoami").value;
	employerID = document.getElementById("employerID").value;
	employer = await getUserProfile(employerID);
	renderEmployerProfile(employer);

	empJobPosts = await getCompanyJobPosts(employerID);
	empJobPosts.forEach(job => renderJobPost(job, empJobPostsDiv, whoami===employerID));

	renderNumPosts();

	empPostForm.addEventListener("submit", createPost);
}

window.addEventListener("load", initPage);

async function updateEmployerProfile(e){
	e.preventDefault();
	const updated = {
		name: document.querySelector("#newCompanyName").value,
		location: document.querySelector("#newCompanyLocation").value,
		email: document.querySelector("#newCompanyEmail").value,
		phone: document.querySelector("#newCompanyPhone").value,
		facebook: document.querySelector("#newCompanyFacebook").value,
		instagram: document.querySelector("#newCompanyInstagram").value,
		twitter: document.querySelector("#newCompanyTwitter").value,
		linkedin: document.querySelector("#newCompanyLinkedin").value,
		about: document.querySelector("#newCompanyAbout").value
	}
	const res = await modifyUserProfile(updated);
	if(res.error) {
		renderProfileErr(res.error);
		return;
	}
	employer = updated;
	renderEmployerProfile(employer);
	$("#modalEditProfile").modal('hide');
}

async function createPost(e) {
	e.preventDefault();

	const jobPost = {
		title: empPostForm.elements["newJobTitle"].value,
		salary: empPostForm.elements["newJobSalary"].value,
		province: empPostForm.elements["newJobState"].value,
		city: empPostForm.elements["newJobCity"].value,
		category: empPostForm.elements["newJobCategory"].value,
		desc: empPostForm.elements["newJobDescription"].value,
		url: empPostForm.elements["newJobUrl"].value,
	};

	const res = await createJobPost(jobPost);
	if(res.error) {
		renderEmpFormErr(res.error);
		return;
	}

	clearEmpForm();

	empJobPosts.push(res);
	renderJobPost(res, empJobPostsDiv, whoami===employerID);
	renderNumPosts();
}

function editProfileModalLoad(e) {
	e.preventDefault();

	fillInInfo(employer);
}

async function jobsClickListener(e) {
	if(e.target.classList.contains("delete"))
		await deletePost(e);
}

async function deletePost(e) {
	const postDiv = e.target.parentElement.parentElement.parentElement;
	const idx = Array.prototype.indexOf.call(empJobPostsDiv.children, postDiv);
	const deleted = await deleteJobPost(empJobPosts[idx]._id);
	if(!deleted) return;
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
	facebook.hidden = !employer.facebook || employer.facebook==="";
	facebook.href = "http://" + employer.facebook;
	const instagram = document.getElementById("companyInstagram");
	instagram.hidden = !employer.instagram || employer.instagram==="";
	instagram.href = "http://" + employer.instagram;
	const twitter = document.getElementById("companyTwitter");
	twitter.hidden = !employer.twitter || employer.twitter==="";
	twitter.href = "http://" + employer.twitter;
	const linkedin = document.getElementById("companyLinkedin");
	linkedin.hidden = !employer.linkedin || employer.linkedin==="";
	linkedin.href = "http://" + employer.linkedin;
	const about = document.getElementById("companyAbout");
	about.innerText = employer.about ? employer.about : "";
}

function fillInInfo(employerInfo) {
	const name = document.getElementById("newCompanyName");
	name.value = employerInfo.name || "";
	const locate = document.getElementById("newCompanyLocation");
	locate.value = employerInfo.location || "";
	const email = document.getElementById("newCompanyEmail");
	email.value = employerInfo.email || "";
	const phone = document.getElementById("newCompanyPhone");
	phone.value = employerInfo.phone || "";
	const facebook = document.getElementById("newCompanyFacebook");
	facebook.value = employerInfo.facebook || "";
	const instagram = document.getElementById("newCompanyInstagram");
	instagram.value = employerInfo.instagram || "";
	const twitter = document.getElementById("newCompanyTwitter");
	twitter.value = employerInfo.twitter || "";
	const linkedin = document.getElementById("newCompanyLinkedin");
	linkedin.value = employerInfo.linkedin || "";
	const about = document.getElementById("newCompanyAbout");
	about.value = employerInfo.about || "";
}

function renderNumPosts() {
	empNumPostsSpan.innerText = empJobPosts.length;
}

function renderProfileErr(errText) {
	document.querySelector("#invalidProfileSpan").innerText = errText;
}

function renderEmpFormErr(errText) {
	document.querySelector("#invalidPostSpan").innerText = errText;
}

function clearEmpForm() {
	empPostForm.elements["newJobTitle"].value = "";
	empPostForm.elements["newJobSalary"].value = "";
	empPostForm.elements["newJobState"].value = undefined;
	empPostForm.elements["newJobCity"].value = undefined;
	empPostForm.elements["newJobUrl"].value = "";
	empPostForm.elements["newJobCategory"].value = undefined;
	empPostForm.elements["newJobDescription"].value = "";
	document.querySelector("#invalidPostSpan").innerText = "";
	$("#modalCreateJob").modal('hide');
}

function removePostDiv(postDiv) {
	empJobPostsDiv.removeChild(postDiv);
	renderNumPosts();
}
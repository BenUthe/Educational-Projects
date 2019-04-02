"use strict";

let users = [], companies = [], jobPosts = [];
let usersUl, companiesUl, jobPostsDiv;

async function initPage(e) {
	users = getAllUsers();
	companies = getAllCompanies();
	jobPosts = await getAllJobPosts();

	usersUl = document.querySelector("#users");
	usersUl.addEventListener("click", usersClickListener);
	users.forEach(user => renderAccount(user, usersUl));
	renderNumUsers();

	companiesUl = document.querySelector("#companies");
	companiesUl.addEventListener("click", companiesClickListener);
	companies.forEach(company => renderAccount(company, companiesUl));
	renderNumCompanies();

	jobPostsDiv = document.querySelector("#jobPostings");
	jobPostsDiv.addEventListener("click", jobsClickListener);
	jobPosts.forEach(job => renderJobPost(job, jobPostsDiv, true));
	renderNumPosts();
}

window.addEventListener("load", initPage);

function usersClickListener(e) {
	if(e.target.classList.contains("delete"))
		deleteUser(e);
}

function deleteUser(e) {
	const userLi = e.target.parentElement.parentElement;
	const idx = Array.prototype.indexOf.call(usersUl.children, userLi);
	deleteAccount(users[idx]._id);
	users.splice(idx, 1);
	removeUserLi(userLi);
}

function companiesClickListener(e) {
	if(e.target.classList.contains("delete"))
		deleteCompany(e);
}

function deleteCompany(e) {
	const companyLi = e.target.parentElement.parentElement;
	const idx = Array.prototype.indexOf.call(companiesUl.children, companyLi);
	deleteAccount(companies[idx]._id);
	companies.splice(idx, 1);
	removeCompanyLi(companyLi);
}

async function jobsClickListener(e) {
	if(e.target.classList.contains("delete"))
		await deletePost(e);
}

async function deletePost(e) {
	const postDiv = e.target.parentElement.parentElement.parentElement;
	const idx = Array.prototype.indexOf.call(jobPostsDiv.children, postDiv);
	const deleted = await deleteJobPost(jobPosts[idx]._id);
	if(!deleted) return;
	jobPosts.splice(idx, 1);
	removePostDiv(postDiv);
}

/** DOM MANIPULATING FUNCTIONS */
function renderAccount(account, accountUl) {
	const accountLi = document.createElement("li");
	accountLi.className = "list-group-item d-flex justify-content-between align-items-center";
	accountLi.innerHTML = `<span>${account}</span>
      <span>
        <a href="${getProfileLink(account)}"><button type="button" class="btn btn-success rounded-circle" data-toggle="tooltip" data-placement="bottom" title="View profile"><i class="far fa-eye"></i></button></a>
        <!--<button type="button" class="btn btn-primary rounded-circle" data-toggle="tooltip" data-placement="bottom" title="Edit details of this user"><i class="fas fa-pen"></i></button>-->
        <button type="button" class="delete btn btn-danger rounded-circle" data-toggle="tooltip" data-placement="bottom" title="Delete account"><i class="no-click fas fa-times"></i></button>
      </span>`;
    accountUl.appendChild(accountLi);
}

function renderNumUsers() {
	document.querySelector("#numUsers").innerText = users.length;
}

function renderNumCompanies() {
	document.querySelector("#numCompanies").innerText = companies.length;
}

function renderNumPosts() {
	document.querySelector("#numPosts").innerText = jobPosts.length;
}

function removeUserLi(userLi) {
	usersUl.removeChild(userLi);
	renderNumUsers();
}

function removeCompanyLi(companyLi) {
	companiesUl.removeChild(companyLi);
	renderNumCompanies();
}

function removePostDiv(postDiv) {
	jobPostsDiv.removeChild(postDiv);
	renderNumPosts();
}

/** BACKEND MANIPULATING FUNCTIONS */
function deleteAccount(id) {
	// Delete account from db
	// code below requires server call
	return true;
}

function getAllUsers() {
	// Get all users from db
	// code below requires server call
	// this function will be rewritten
	// to only get a few users (pagination)
	// from backend (when it is implemented)
	return ["User 1", "User 2"];
}

function getAllCompanies() {
	// Get all companies from db
	// code below requires server call
	// this function will be rewritten
	// to only get a few companies (pagination)
	// from backend (when it is implemented)
	return ["Company 1", "Company 2"];
}

function getProfileLink(user) {
	// technically server should already populate
	// page with the appropriate links to profiles
	// for existing users before serving the page to
	// client... this shall be done when we write backend
	if(users.includes(user))
		return "user_profile.html";

	return "employer_profile.html";
}
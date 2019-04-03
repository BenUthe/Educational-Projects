"use strict";

let users = [], companies = [], jobPosts = [];
let usersUl, companiesUl, jobPostsDiv;

async function initPage(e) {
	users = await getAllApplicants();
	companies = await getAllEmployers();
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
	for(var job of jobPosts) await renderJobPost(job, jobPostsDiv, true);
	renderNumPosts();
}

window.addEventListener("load", initPage);

async function usersClickListener(e) {
	if(e.target.classList.contains("delete"))
		await deleteUser(e);
}

async function deleteUser(e) {
	const userLi = e.target.parentElement.parentElement;
	const idx = Array.prototype.indexOf.call(usersUl.children, userLi);
	const deleted = await deleteAccount(users[idx]._id);
	if(!deleted) {
		alert('Something went wrong...');
		return;
	}
	users.splice(idx, 1);
	removeUserLi(userLi);
}

async function companiesClickListener(e) {
	if(e.target.classList.contains("delete"))
		await deleteCompany(e);
}

async function deleteCompany(e) {
	const companyLi = e.target.parentElement.parentElement;
	const idx = Array.prototype.indexOf.call(companiesUl.children, companyLi);
	const postsDeleted = await deleteCompanyPosts(companies[idx]._id);
	if(!postsDeleted) {
		alert('Something went wrong...');
		return;
	}
	for(var i = jobPosts.length - 1; i >= 0; i--) {
		if(jobPosts[i].creator.toString() === companies[idx]._id.toString()) {
			jobPosts.splice(i,1);
			removePostDiv(jobPostsDiv.children[i]);
		}
	}
	const deleted = await deleteAccount(companies[idx]._id);
	if(!deleted) {
		alert('Something went wrong...');
		return;
	}
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
	if(!deleted) {
		alert('Something went wrong...');
		return;
	}
	jobPosts.splice(idx, 1);
	removePostDiv(postDiv);
}

/** DOM MANIPULATING FUNCTIONS */
function renderAccount(account, accountUl) {
	const accountLi = document.createElement("li");
	accountLi.className = "list-group-item d-flex justify-content-between align-items-center";
	accountLi.innerHTML = `<span>${account.username}</span>
      <span>
        <a href="/u/${account._id}"><button type="button" class="btn btn-success rounded-circle" data-toggle="tooltip" data-placement="bottom" title="View profile"><i class="far fa-eye"></i></button></a>
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
async function deleteAccount(id) {
	// Should delete the given job post from db
	// code below requires server call
	const url = `/users/${id}`;
	const request = new Request(url, {
	        method: 'DELETE',
	        body: JSON.stringify({}),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
	    });

	const res = await fetch(request);
	return res.status === 200;
}

async function deleteCompanyPosts(id) {
	const url = `/posts/${id}`;
	const request = new Request(url, {
	        method: 'DELETE',
	        body: JSON.stringify({}),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
	    });

	const res = await fetch(request);
	return res.status === 200;
}

async function getAllApplicants() {
	// Get all users from db
	// code below requires server call
	// this function will be rewritten
	// to only get a few users (pagination)
	// from backend (when it is implemented)
	//return ["User 1", "User 2"];
	const url = `/applicants`;
    // The data we are going to send in our request
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    const res = await fetch(request)
    const json = await res.json();
    if(json.error) {
		alert(json.error);
	} else if(json.redirect) {
		window.location.href = json.redirect;
	}

    return json;
}

async function getAllEmployers() {
	// Get all companies from db
	// code below requires server call
	// this function will be rewritten
	// to only get a few companies (pagination)
	// from backend (when it is implemented)
	//return ["Company 1", "Company 2"];
	const url = `/employers`;
    // The data we are going to send in our request
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    const res = await fetch(request)
    const json = await res.json();
    if(json.error) {
		alert(json.error);
	} else if(json.redirect) {
		window.location.href = json.redirect;
	}

    return json;
}
"use strict";

let jobPosts = [];
let searchForm, categoriesForm, locationsForm, jobPostsDiv;

function initListings(e) {
	searchForm = document.forms["searchForm"];
	searchForm.addEventListener("submit", searchJobs);

	categoriesForm = document.forms["filterCategories"];
	categoriesForm.addEventListener("change", filterPosts);

	locationsForm = document.forms["filterLocations"];
	locationsForm.addEventListener("change", filterPosts);

	jobPostsDiv = document.querySelector("#jobPostings");

	jobPosts = getJobPosts();
	jobPosts.forEach(renderJobPost);
	updateFilterOptions();
}

window.addEventListener("load", initListings);

class JobPost {
	constructor(title, company, salary, time, city, province, desc) {
		this.title = title;
		this.company = company;
		this.salary = salary;
		this.time = time;
		this.city = city;
		this.province = province;
		this.desc = desc;
	}
}

function searchJobs(e) {
	e.preventDefault();

	const reKeywords = new RegExp(searchForm.elements["keywords"].value.split(" ").join("|"), "i");
	const reLocation = new RegExp(searchForm.elements["location"].value, "i");
	jobPosts = getJobPosts().filter(job =>
		(job.title.match(reKeywords) || job.desc.match(reKeywords) || job.company.match(reKeywords))
		&& (job.province.match(reLocation) || job.city.match(reLocation)));

	clearJobPosts();
	jobPosts.forEach(renderJobPost);
	updateFilterOptions();
}

function updateFilterOptions() {
	const timesList = [];
	const citiesList = [];

	for (let i = 0; i < jobPosts.length; i++) {
		if(!timesList.includes(jobPosts[i].time))
			timesList.push(jobPosts[i].time);
		if(!citiesList.includes(jobPosts[i].city))
			citiesList.push(jobPosts[i].city);
	}

	updateFilterForms(timesList, citiesList);
}

function filterPosts(e) {
	const checkedTimes = categoriesForm.querySelectorAll("input:checked");
	const checkedLocations = locationsForm.querySelectorAll("input:checked");

	if(checkedTimes.length === 0 && checkedLocations.length === 0) {
		clearJobPosts();
		jobPosts.forEach(renderJobPost);
		return;
	}

	const newJobs = jobPosts.filter(job => isValidJob(job, checkedTimes, checkedLocations));

	clearJobPosts();
	newJobs.forEach(renderJobPost);
}

function isValidJob(job, timesAllowed, locsAllowed) {
	let timeMatch = timesAllowed.length === 0;
	for(let i = 0; i < timesAllowed.length; i++) {
		if(timesAllowed[i].value === job.time) {
			timeMatch = true;
			break;
		}
	}

	let locationMatch = locsAllowed.length === 0;
	for(let i = 0; i < locsAllowed.length; i++) {
		if(locsAllowed[i].value === job.city) {
			locationMatch = true;
			break
		}
	}

	// TODO SALARY MATCH

	return timeMatch && locationMatch;
}


/** DOM MANIPULATING FUNCTIONS */
function renderJobPost(jobPost) {
	const postDiv = document.createElement("div");
	postDiv.className = "card w-100 mb-3";
	postDiv.innerHTML = `<div class="card-body">
	      <h5 class="card-title">${jobPost.title} |<small class="text-muted"> ${jobPost.company}</small></h5>
	      <h6 class="card-subtitle mb-2 text-muted">
	        <button type="button" class="jobSalary btn btn-outline-success mr-2 my-2"><i class="fas fa-money-check-alt"></i> $${jobPost.salary}</button>
	        <button type="button" class="jobLocation btn btn-outline-dark mr-2 my-2"><i class="fas fa-map-marked-alt"></i> ${jobPost.city}</button>
	        <button type="button" class="jobCategory btn btn-outline-dark"><i class="fas fa-business-time"></i> ${jobPost.time}</button>
	      </h6>
	      <p class="card-text">${jobPost.desc}</p>
	      <a href="#" class="btn btn-primary">Go somewhere</a>
	    </div>
	  </div>`;

	jobPostsDiv.appendChild(postDiv);
}

function clearJobPosts() {
	// delete all job post entries in DOM
	while(jobPostsDiv.hasChildNodes())
		jobPostsDiv.removeChild(jobPostsDiv.lastChild);
}

function updateFilterForms(timesList, citiesList) {
	// TODO: reset salary range

	// update time categories
	while(categoriesForm.hasChildNodes())
		categoriesForm.removeChild(categoriesForm.lastChild);

	for(let i = 0; i < timesList.length; i++) {
		const timeDiv = document.createElement("div");
		timeDiv.className = "custom-control custom-checkbox";
		timeDiv.innerHTML =
			`<input type="checkbox" class="custom-control-input" id="filterTime${i}" name="filterTime${i}" value="${timesList[i]}">
			<label class="custom-control-label" for="filterTime${i}">${timesList[i]}</label>`;
		categoriesForm.appendChild(timeDiv);
	}

	// update locations
	while(locationsForm.hasChildNodes())
		locationsForm.removeChild(locationsForm.lastChild);

	for(let i = 0; i < citiesList.length; i++) {
		const cityDiv = document.createElement("div");
		cityDiv.className = "custom-control custom-checkbox";
		cityDiv.innerHTML =
			`<input type="checkbox" class="custom-control-input" id="filterLocation${i}" name="filterLocation${i}" value="${citiesList[i]}">
			<label class="custom-control-label" for="filterLocation${i}">${citiesList[i]}</label>`;
		locationsForm.appendChild(cityDiv);
	}
}


/** BACKEND INVOLVING FUNCTIONS */
function getJobPosts() {
	// Get job posts from server
	// code below requires server call
	return [
	new JobPost(
		"Job 1",
		"Company 1",
		60000,
		"Part-Time",
		"Toronto",
		"Ontario",
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
	),
	new JobPost(
		"Job 2",
		"Company 1",
		20000,
		"Contract",
		"Vancouver",
		"British Columbia",
		"Nunc nibh sem, gravida sit amet metus egestas, condimentum consectetur erat. Etiam " +
		"sed ante vitae neque gravida euismod. Proin ultricies tincidunt tortor, et molestie " +
		"eros interdum in. Suspendisse sagittis iaculis elit ut sodales. Curabitur interdum " +
		"libero in arcu fringilla bibendum. Fusce rhoncus nulla eget justo facilisis, ut " +
		"pulvinar ex volutpat. Morbi accumsan auctor tellus eget ullamcorper."
	),
	new JobPost(
		"Job 3",
		"Company 1",
		90000,
		"Full-Time",
		"Halifax",
		"Nova Scotia",
		"Proin tempor enim quis metus eleifend, id suscipit felis semper. In hac habitasse " +
		"platea dictumst. Morbi euismod gravida rhoncus. Etiam elementum venenatis dictum. " +
		"Praesent tellus nisl, feugiat ac accumsan a, imperdiet molestie metus. Proin " +
		"vitae sodales velit. Ut efficitur euismod tortor, nec congue odio vehicula eget. " +
		"Aenean sit amet auctor ante. Nunc aliquam turpis at volutpat accumsan. Nulla " +
		"placerat quis arcu in hendrerit. Aliquam dolor nisl, posuere nec varius et, " +
		"molestie in turpis. Aliquam id justo facilisis, finibus quam non, blandit felis. " +
		"Quisque blandit metus sed arcu cursus consequat at eu elit. Nunc tincidunt elit " +
		"a libero faucibus aliquet."
	)];
}

"use strict";

let jobPosts = [];
let searchForm, categoriesForm, locationsForm, jobPostsDiv;
let minSalarySlider, minSalaryText, maxSalarySlider, maxSalaryText;

async function initListings(e) {
	searchForm = document.forms["searchForm"];
	searchForm.addEventListener("submit", searchJobs);

	categoriesForm = document.forms["filterCategories"];
	categoriesForm.addEventListener("change", filterPosts);

	locationsForm = document.forms["filterLocations"];
	locationsForm.addEventListener("change", filterPosts);

	jobPostsDiv = document.querySelector("#jobPostings");

	jobPosts = await getAllJobPosts();
	for(var job of jobPosts) await renderJobPost(job, jobPostsDiv);

	// Event Listeners for syncing salary slider and textboxes
	minSalarySlider = document.querySelector("#filterMinSalary");
	maxSalarySlider = document.querySelector("#filterMaxSalary");

	minSalaryText = document.querySelector("#filterMinSalaryText");
	maxSalaryText = document.querySelector("#filterMaxSalaryText");

	minSalarySlider.addEventListener("change", syncSalary);
	minSalarySlider.addEventListener("change", filterPosts);
	minSalaryText.addEventListener("change", syncSalary);
	minSalaryText.addEventListener("change", filterPosts);
	maxSalarySlider.addEventListener("change", syncSalary);
	maxSalarySlider.addEventListener("change", filterPosts);
	maxSalaryText.addEventListener("change", syncSalary);
	maxSalaryText.addEventListener("change", filterPosts);

	updateFilterOptions();

}

window.addEventListener("load", initListings);

async function searchJobs(e) {
	e.preventDefault();

	const reKeywords = new RegExp(searchForm.elements["keywords"].value.split(" ").join("|"), "i");
	const reLocation = new RegExp(searchForm.elements["location"].value, "i");
	jobPosts = await getAllJobPosts()
	jobPosts = jobPosts.filter(job =>
		(job.title.match(reKeywords) || job.desc.match(reKeywords) || job.company.match(reKeywords))
		&& (job.province.match(reLocation) || job.city.match(reLocation)));

	clearJobPosts(jobPostsDiv);

	for(var job of jobPosts) await renderJobPost(job, jobPostsDiv);
	updateFilterOptions();
}

function updateFilterOptions() {
	const timesList = [];
	const citiesList = [];

	for (let i = 0; i < jobPosts.length; i++) {
		if(!timesList.includes(jobPosts[i].category))
			timesList.push(jobPosts[i].category);
		if(!citiesList.includes(jobPosts[i].city))
			citiesList.push(jobPosts[i].city);
	}

	updateFilterForms(timesList, citiesList);
}

async function filterPosts(e) {
	const checkedTimes = categoriesForm.querySelectorAll("input:checked");
	const checkedLocations = locationsForm.querySelectorAll("input:checked");

	const newJobs = jobPosts.filter(job => isValidJob(job, checkedTimes, checkedLocations));

	clearJobPosts(jobPostsDiv);
	for(var job of newJobs) await renderJobPost(job, jobPostsDiv);
}

function isValidJob(job, timesAllowed, locsAllowed) {
	let salaryMatch = minSalarySlider.value <= job.salary && job.salary <= maxSalarySlider.value;

	let timeMatch = timesAllowed.length === 0;
	for(let i = 0; i < timesAllowed.length; i++) {
		if(timesAllowed[i].value === job.category) {
			timeMatch = true;
			break;
		}
	}

	let locationMatch = locsAllowed.length === 0;
	for(let i = 0; i < locsAllowed.length; i++) {
		if(locsAllowed[i].value === job.city) {
			locationMatch = true;
			break;
		}
	}

	return salaryMatch && timeMatch && locationMatch;
}

function syncSalary(e) {
	const elementValue = this.value;
	const elementID = this.id.substring(6, 9);
	const elementType = this.type;

	renderSalaryValue(elementID, elementType);
}

function formatAmount(amt) {
	try {
		return parseInt(amt).toLocaleString();
	} catch {
		return "0";
	}
}

/** DOM MANIPULATING FUNCTIONS */
function updateFilterForms(timesList, citiesList) {
	// TODO: reset salary range
	minSalarySlider.value = minSalaryText.value = 0;
	maxSalarySlider.value = maxSalaryText.value = 1000000;

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

function renderSalaryValue(elementID, elementType) {
	let srcElement;
	let destElement;
	// Determine if slider was changed or text was changed
	if (elementType == "range") {
		srcElement = document.querySelector(`#filter${elementID}Salary`);
		destElement = document.querySelector(`#filter${elementID}SalaryText`);
		destElement.value = formatAmount(srcElement.value); //format the value if it's a textbox
	} else {
		srcElement = document.querySelector(`#filter${elementID}SalaryText`);
		destElement = document.querySelector(`#filter${elementID}Salary`);
		destElement.value = srcElement.value.split(',').join('');
	}

}
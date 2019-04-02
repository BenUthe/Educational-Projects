"use strict";

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

/** DOM MANIPULATING FUNCTIONS */
async function renderJobPost(jobPost, jobPostsDiv, manageable=false) {
	const company = await getUserProfile(jobPost.creator);
	const postDiv = document.createElement("div");
	postDiv.className = "card w-100 mb-3";
	postDiv.innerHTML = `<div class="card-body">
	      <div class="d-flex justify-content-between align-items-center">
            <h5 class="card-title">${jobPost.title} |<small class="text-muted"> <a href="/u/${jobPost.creator}">${company.name}</a></small></h5>
              <!--<button type="button" class="btn btn-primary rounded-circle" data-toggle="tooltip" data-placement="bottom" title="Edit post"><i class="fas fa-pen"></i></button>-->
              ${manageable ? '<button type="button" class="delete btn btn-danger rounded-circle" data-toggle="tooltip" data-placement="bottom" title="Delete post"><i class="no-click fas fa-times"></i></button>' : ""}
          </div>
	      <h6 class="card-subtitle mb-2 text-muted">
	        <button type="button" class="jobSalary btn btn-outline-success mr-2 my-2"><i class="fas fa-money-check-alt"></i> $${jobPost.salary}</button>
	        <button type="button" class="jobLocation btn btn-outline-dark mr-2 my-2"><i class="fas fa-map-marked-alt"></i> ${jobPost.city}</button>
	        <button type="button" class="jobCategory btn btn-outline-dark"><i class="fas fa-business-time"></i> ${jobPost.category}</button>
	      </h6>
	      <p class="card-text">${jobPost.desc}</p>
	      <a href="http://${jobPost.url}" target="_blank" class="btn btn-primary">Apply Externally</a>
	    </div>
	  </div>`;

	jobPostsDiv.appendChild(postDiv);
}

function clearJobPosts(jobPostsDiv) {
	// delete all job post entries in DOM
	while(jobPostsDiv.hasChildNodes())
		jobPostsDiv.removeChild(jobPostsDiv.lastChild);
}

/** BACKEND INVOLVING FUNCTIONS */
async function createJobPost(jobPost) {
	// Should send the new post entry to the server
	// so the server can store the entry in the db
	// code below requires server call
	const url = '/post';
	const request = new Request(url, {
	        method: 'post',
	        body: JSON.stringify(jobPost),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
	    });
	const res = await fetch(request);
	const json = await res.json();
	if(json.error) {
		return json;
	}
	else if(json.redirect) {
		window.location.href = json.redirect;
	}
	else {
		return json;
	}
}

async function deleteJobPost(jobPostID) {
	// Should delete the given job post from db
	// code below requires server call
	const url = `/post/${jobPostID}`;
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

async function getAllJobPosts() {
	// Get all job posts from server
	// code below requires server call.
	// When we write backend code
	// pagination will be performed
	// so only a few posts wil be fetched.
	const url = `/posts`;
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

async function getCompanyJobPosts(company) {
	// Get job posts of company from server
	// code below requires server call
	// When we write backend code
	// pagination will be performed
	// so only a few posts wil be fetched.
	const url = `/posts/${company}`;
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
	/*return [
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
	)];*/
}

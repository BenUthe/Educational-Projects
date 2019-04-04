"use strict";

/** DOM MANIPULATING FUNCTIONS */
async function renderJobPost(jobPost, jobPostsDiv, manageable=false) {
	const company = await getUserProfile(jobPost.creator);
	const postDiv = document.createElement("div");
	let link = jobPost.url;
	if(link)
		link = (link.indexOf('://') === -1) ? 'http://' + link : link;
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
	const url = `/posts`;
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
	const url = `/posts/${company}`;
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

/** BACKEND INVOLVING FUNCTIONS */
async function getUserProfile(id) {
	// Get company profile info from server
	// code below requires server call
	// Needs to take a session id or such
	// as input later on.
	const url = `/profile/${id}`;
	let profile;
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
	} else {
		profile = json;
	}

    return profile;
	/*const employerProfile = new EmployerProfile(
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
	return employerProfile;*/
}

async function modifyUserProfile(user) {
	// Send updated profile info to server
	// code below requires server call
	const url = '/profile';
	const request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(user),
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
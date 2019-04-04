/** BACKEND INVOLVING FUNCTIONS */
async function getUserProfile(id) {
	// Get profile info from server
	const url = `/profile/${id}`;
	let profile;
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
}

async function modifyUserProfile(user) {
	// Send updated profile info to server
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

function handleUpload() {
	// send profile picture to server
	let formData = new FormData();
	var fileField = document.querySelector("input[name='profilePic']");
	if(!fileField.files[0]) return false;

	formData.append('image', fileField.files[0]);


	fetch('/profile-picture', {
	  method: 'post',
	  body: formData
	})
	.then(response => response.json())
	.catch(error => {
		console.error('Error:', error);
		invalidInput('pictureFail', error);
	})
	.then(response => {
		console.log('Success:', JSON.stringify(response));
		updateProfilePic(response.picture);
		closeModal();
	});

	return false;
}

function handleResume() {
	// send resume to server
	let formData = new FormData();
	var fileField = document.querySelector("input[name='resumeFile']");
	if(!fileField.files[0]) return false;

	formData.append('resume', fileField.files[0]);


	fetch('/profile-resume', {
	  method: 'post',
	  body: formData
	})
	.then(response => response.json())
	.catch(error => {
		console.error('Error:', error);
		invalidInput('resumeFail', error);
	})
	.then(response => {
		console.log('Success:', JSON.stringify(response));
		updateResume(response.resume);
		closeResumeModal();
	});

	return false;
}
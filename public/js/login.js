function handleLogin() {
	const loginForm = document.forms["loginForm"];
	const signUpForm = document.forms["signUpForm"];
	const username = loginForm.elements["username"].value;
	const password = loginForm.elements["password"].value;

	const url = '/users/login';
    let data = {username, password}
    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        return res.json()
    })
    .then((json) => {
    	if(json.error)
    		invalidInput('invalidEntry', json.error);
    	else if(json.redirect)
    		window.location.href = json.redirect;
    })
    .catch((error) => {
        console.log(error)
    })

    return false;
}

function handleSignUp() {
	const username = signUpForm.elements["username1"].value;
	const email = signUpForm.elements["email1"].value;
	const password = signUpForm.elements["password1"].value;
	const password2 = signUpForm.elements["password2"].value;
	const utype = signUpForm.elements["newUser"].value;
	const name = signUpForm.elements["name"].value;
	const location = signUpForm.elements["location"].value;
	const phone = signUpForm.elements["phoneNumber"].value;

	if(password === password2) {
		const url = '/users';
	    let data = {username, password, email, utype, name, location, phone};
	    const request = new Request(url, {
	        method: 'post',
	        body: JSON.stringify(data),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
	    });
	    fetch(request)
	    .then(function(res) {
	        return res.json();
	    })
	    .then((json) => {
	    	console.log(json);
	    	if(json.error)
	    		invalidInput('invalidEntry1', json.error);
	    	else if(json.redirect)
	    		window.location.href = json.redirect;
	    })
	    .catch((error) => {
	        console.log(error);
	    })
	} else {
		invalidInput('invalidEntry1', "Passwords Do Not Match");
	}

	return false;
}

function invalidInput(inputID, message) {
	const error = document.getElementById(inputID);
	error.setAttribute("class", "text-danger font-italic");
	error.innerText=message;
}
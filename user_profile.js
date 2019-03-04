"use strict";

class UserProfile {
	constructor(name, location, email, phone, facebook, instagram, twitter, linkedin) {
		this.name = name;
		this.location = location;
		this.email = email;
		this.phone = phone;
		this.facebook = facebook;
		this.instagram = instagram;
		this.twitter = twitter;
		this.linkedin = linkedin;
	}
}

let user;
let editProfileBtn, submitEdit;

function initPage(e) {
	editProfileBtn = document.getElementById("editUser");
	editProfileBtn.addEventListener("click", editProfileModalLoad);
	submitEdit = document.forms["editProfile"];
	submitEdit.addEventListener("submit", updateUserProfile);

	user = getUserProfile();
	renderUserProfile(user);
}

window.addEventListener("load", initPage);

function updateUserProfile(e){
	e.preventDefault();
	user.name = document.querySelector("#newUserName").value;
	user.location = document.querySelector("#newUserLocation").value;
	user.email = document.querySelector("#newUserEmail").value;
	user.phone = document.querySelector("#newUserPhone").value;
	user.facebook = document.querySelector("#newUserFacebook").value;
	user.instagram = document.querySelector("#newUserInstagram").value;
	user.twitter = document.querySelector("#newUserTwitter").value;
	user.linkedin = document.querySelector("#newUserLinkedin").value;

	modifyUserProfile(user);

	renderUserProfile(user);
	$("#modalEditProfile").modal('hide');
}

function editProfileModalLoad(e) {
	e.preventDefault();

	fillInInfo(user);
}

/** DOM MANIPULATING FUNCTIONS */
function renderUserProfile(user){
	const name = document.getElementById("userName");
	name.innerText = user.name;
	const location = document.getElementById("userLocation");
	location.innerText = user.location;
	const email = document.getElementById("userEmail");
	email.innerText = user.email;
	const phone = document.getElementById("userPhone");
	phone.innerText = user.phone;
	const facebook = document.getElementById("userFacebook");
	facebook.hidden = user.facebook==="";
	facebook.href = user.facebook;
	const instagram = document.getElementById("userInstagram");
	instagram.hidden = user.instagram==="";
	instagram.href = user.instagram;
	const twitter = document.getElementById("userTwitter");
	twitter.hidden = user.twitter==="";
	twitter.href = user.twitter;
	const linkedin = document.getElementById("userLinkedin");
	linkedin.hidden = user.linkedin==="";
	linkedin.href = user.linkedin;
}

function fillInInfo(userInfo) {
	const name = document.getElementById("newUserName");
	name.value = userInfo.name;
	const locate = document.getElementById("newUserLocation");
	locate.value = userInfo.location;
	const email = document.getElementById("newUserEmail");
	email.value = userInfo.email;
	const phone = document.getElementById("newUserPhone");
	phone.value = userInfo.phone;
	const facebook = document.getElementById("newUserFacebook");
	facebook.value = userInfo.facebook;
	const instagram = document.getElementById("newUserInstagram");
	instagram.value = userInfo.instagram;
	const twitter = document.getElementById("newUserTwitter");
	twitter.value = userInfo.twitter;
	const linkedin = document.getElementById("newUserLinkedin");
	linkedin.value = userInfo.linkedin;
}

/** BACKEND INVOLVING FUNCTIONS */
function getUserProfile() {
	// Get company profile info from server
	// code below requires server call
	// Needs to take a session id or such
	// as input later on.

	const userProfile = new UserProfile(
		"User 1",
		"Toronto, ON",
		"email@user.com",
		"(416)-262-6667",
		"https://www.facebook.com",
		"https://www.instagram.com",
		"https://www.twitter.com",
		"https://www.linkedin.com"
	);
	return userProfile;
}

function modifyUserProfile(user) {
	// Send updated profile info to server
	// code below requires server call
	return true;
}
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

let whoami;
let user, userID;
let editProfileBtn, submitEdit;

async function initPage(e) {
	editProfileBtn = document.getElementById("editUser");
	if(editProfileBtn) editProfileBtn.addEventListener("click", editProfileModalLoad);
	submitEdit = document.forms["editProfile"];
	submitEdit.addEventListener("submit", updateUserProfile);

	whoami = document.getElementById("whoami").value;
	userID = document.getElementById("userID").value;
	user = await getUserProfile(userID);
	renderUserProfile(user);
	
	
	let profilePic = document.querySelector(".pic-container");
	profilePic.addEventListener("mouseover", showProfilePicBtn);
	profilePic.addEventListener("mouseout", hideProfilePicBtn);
}

window.addEventListener("load", initPage);

async function updateUserProfile(e){
	e.preventDefault();
	const updated = {
		name: document.querySelector("#newUserName").value,
		location: document.querySelector("#newUserLocation").value,
		email: document.querySelector("#newUserEmail").value,
		phone: document.querySelector("#newUserPhone").value,
		facebook: document.querySelector("#newUserFacebook").value,
		instagram: document.querySelector("#newUserInstagram").value,
		twitter: document.querySelector("#newUserTwitter").value,
		linkedin: document.querySelector("#newUserLinkedin").value
	};

	const res = await modifyUserProfile(updated);
	if(res.error) {
		renderProfileErr(res.error);
		return;
	}
	user = updated
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
	facebook.hidden = !user.facebook || user.facebook==="";
	facebook.href = "http://" + user.facebook;
	const instagram = document.getElementById("userInstagram");
	instagram.hidden = !user.instagram || user.instagram==="";
	instagram.href = "http://" + user.instagram;
	const twitter = document.getElementById("userTwitter");
	twitter.hidden = !user.twitter || user.twitter==="";
	twitter.href = "http://" + user.twitter;
	const linkedin = document.getElementById("userLinkedin");
	linkedin.hidden = !user.linkedin || user.linkedin==="";
	linkedin.href = "http://" + user.linkedin;
	const pp = document.getElementById("userProfileBg");
	pp.src = user.picture ? user.picture : "https://via.placeholder.com/150";
}

function fillInInfo(userInfo) {
	const name = document.getElementById("newUserName");
	name.value = userInfo.name || "";
	const locate = document.getElementById("newUserLocation");
	locate.value = userInfo.location || "";
	const email = document.getElementById("newUserEmail");
	email.value = userInfo.email || "";
	const phone = document.getElementById("newUserPhone");
	phone.value = userInfo.phone || "";
	const facebook = document.getElementById("newUserFacebook");
	facebook.value = userInfo.facebook || "";
	const instagram = document.getElementById("newUserInstagram");
	instagram.value = userInfo.instagram || "";
	const twitter = document.getElementById("newUserTwitter");
	twitter.value = userInfo.twitter || "";
	const linkedin = document.getElementById("newUserLinkedin");
	linkedin.value = userInfo.linkedin || "";
}

function renderProfileErr(errText) {
	document.querySelector("#invalidProfileSpan").innerText = errText;
}


function showProfilePicBtn(e){
	const x = document.getElementById("picEditBtn");
	x.style.display = "block";
	/*else {
		x.style.display = "none";
	}*/
}

function hideProfilePicBtn(e){
	const x = document.getElementById("picEditBtn");
		x.style.display = "none";
	/*else {
		x.style.display = "none";
	}*/
}

function updateProfilePic(newSrc){
	const x = document.getElementById("userProfileBg");
	x.src = newSrc;
}

function closeModal(){
	$('#modalEditProfilePicture').modal('hide');
}
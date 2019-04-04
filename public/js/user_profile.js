"use strict";

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
		linkedin: document.querySelector("#newUserLinkedin").value,
		picture: user.picture,
		resume: user.resume
	};

	const res = await modifyUserProfile(updated);
	if(res.error) {
		renderProfileErr(res.error);
		return;
	}
	user = res
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
	facebook.href = cleanURL(user.facebook);
	const instagram = document.getElementById("userInstagram");
	instagram.hidden = !user.instagram || user.instagram==="";
	instagram.href = cleanURL(user.instagram);
	const twitter = document.getElementById("userTwitter");
	twitter.hidden = !user.twitter || user.twitter==="";
	twitter.href = cleanURL(user.twitter);
	const linkedin = document.getElementById("userLinkedin");
	linkedin.hidden = !user.linkedin || user.linkedin==="";
	linkedin.href = cleanURL(user.linkedin);
	const pp = document.getElementById("userProfileBg");
	pp.src = user.picture ? user.picture : "https://via.placeholder.com/150";
	const resumeFile = document.getElementById("btnViewResume");
	console.log(user.resume);
	if (user.resume){
		initPDFViewer(user.resume);
	}
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
	if(!x) return;
	x.style.display = "block";
}

function hideProfilePicBtn(e){
	const x = document.getElementById("picEditBtn");
	if(!x) return;
	x.style.display = "none";
}

function updateProfilePic(newSrc){
	user.picture = newSrc;
	const x = document.getElementById("userProfileBg");
	x.src = newSrc;
}

function closeModal(){
	$('#modalEditProfilePicture').modal('hide');
}


function updateResume(newFile){
	user.resume = newFile;
	initPDFViewer(newFile);
}

function closeResumeModal(){
	$('#modalUploadResume').modal('hide');
}

// misc functions
function cleanURL(link) {
	if(!link) return "";
	return (link.indexOf('://') === -1) ? 'http://' + link : link;
}
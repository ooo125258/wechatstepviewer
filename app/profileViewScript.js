/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

//All functions currently hardcode for a single user template. They will be replaced with information from an
//external server once a database is setup

const {MongoClient, ObjectID} = require('mongodb')

let loggedinuser;

const userinfo = {
        phone: "xxx-xxx-xxxx",
        username: "usera@gmail.com",
        truename: "Bob Smith",
        birthday: "01/01/88",
        address: "5 ceder oakridge",
        zip: "MXM XEX",
        profilepic: "../assets/uoft.jpg",
        interactions: ["Sold A to Person X"],
        furtherinfo: "Contact by email"
}

const uploadDatasetButton = document.querySelector("#uploaddataset");
const changePasswordButton = document.querySelector("#changepassword");
const deleteProfileButton = document.querySelector("#deleteprofile");
const userInteractionList = document.querySelector('#userinteractionhistory').firstElementChild;

function addUserName(){
    //will obtain the username from an external server and display on the webpage
    const nameSpace = document.querySelector('#profilepiccontainer');
    const name = document.createTextNode(user.username);
    nameSpace.appendChild(name);
}
addUserName()

function addProfilePic(){
    //will obtain the profile pic from an external server and display on the webpage
    const picSpace = document.querySelector('#profilepiccontainer');
    const pic = document.createElement('img');
    pic.id = "profilepic";
    pic.src = userinfo.profilepic;
    picSpace.appendChild(pic)
}
addProfilePic();

function addProfileDescription(){
    //will obtain the profile description from an external server and display on the webpage
    const profileDescription = document.querySelector('#profiledescriptioncontainer');
    const truenameContainer = document.createElement('p');
    const truenameText = document.createTextNode("Name: " + loggedinuser.truename);
    truenameContainer.appendChild(truenameText);
    profileDescription.appendChild(truenameContainer);

    const phoneContainer = document.createElement('p');
    const phoneText = document.createTextNode("Phone Number: " + loggedinuser.phone);
    phoneContainer.appendChild(phoneText);
    profileDescription.appendChild(phoneContainer);

    const emailContainer = document.createElement('p');
    const emailText = document.createTextNode("Email: " + loggedinuser.email);
    emailContainer.appendChild(emailText);
    profileDescription.appendChild(emailContainer);

    const birthdayContainer = document.createElement('p');
    const birthdayText = document.createTextNode("D.O.B: " + loggedinuser.birthday);
    birthdayContainer.appendChild(birthdayText);
    profileDescription.appendChild(birthdayContainer);

    const addressContainer = document.createElement('p');
    const addressText = document.createTextNode("Address: " + loggedinuser.address);
    addressContainer.appendChild(addressText);
    profileDescription.appendChild(addressContainer);

    const zipContainer = document.createElement('p');
    const zipText = document.createTextNode("Postal Code: " + loggedinuser.zip);
    zipContainer.appendChild(zipText);
    profileDescription.appendChild(zipContainer);

    const furtherinfoContainer = document.createElement('p');
    const furtherinfoText = document.createTextNode("Further Information: " + loggedinuser.furtherinfo);
    furtherinfoContainer.appendChild(furtherinfoText);
    profileDescription.appendChild(furtherinfoContainer);

    const editButton = document.createElement('button');
    editButton.className = "button";
    const editButtonText = document.createTextNode("Edit Profile");
    editButton.appendChild(editButtonText);
    editButton.addEventListener('click', editProfileInformation);
    profileDescription.appendChild(editButton);

}
addProfileDescription();

function editProfileInformation(e){
    e.preventDefault();
    if (e.target.classList.contains("button")) {
    console.log("clicked edit");
    const profileDescription = document.querySelector('#profiledescriptioncontainer');
    while(profileDescription.firstChild){
        profileDescription.removeChild(profileDescription.firstChild);
    }

    const truenameContainer = document.createElement('input');
    truenameContainer.id = "newtruename";
    truenameContainer.type = "text";
    truenameContainer.placeholder = userinfo.truename;
    profileDescription.appendChild(truenameContainer);

    const phoneContainer = document.createElement('input');
    phoneContainer.id = "newphone";
    phoneContainer.type = "text";
    phoneContainer.placeholder = userinfo.phone;
    profileDescription.appendChild(phoneContainer);

    const emailContainer = document.createElement('input');
    emailContainer.id = "newemail";
    emailContainer.type = "text";
    emailContainer.placeholder = userinfo.email;
    profileDescription.appendChild(emailContainer);

    const birthdayContainer = document.createElement('input');
    birthdayContainer.id = "newbirthday";
    birthdayContainer.type = "text";
    birthdayContainer.placeholder = userinfo.birthday;
    profileDescription.appendChild(birthdayContainer);

    const addressContainer = document.createElement('input');
    addressContainer.id = "newaddress";
    addressContainer.type = "text";
    addressContainer.placeholder = userinfo.address;
    profileDescription.appendChild(addressContainer);

    const zipContainer = document.createElement('input');
    zipContainer.id = "newzip";
    zipContainer.type = "text";
    zipContainer.placeholder = userinfo.zip;
    profileDescription.appendChild(zipContainer);

    const furtherinfoContainer = document.createElement('input');
    furtherinfoContainer.id = "newfurtherinfo";
    furtherinfoContainer.type = "text";
    furtherinfoContainer.placeholder = userinfo.furtherinfo;
    profileDescription.appendChild(furtherinfoContainer);

    const confirmButton = document.createElement('button');
    confirmButton.className = "button";
    confirmButton.formAction = '/changeUserInfo'
    confirmButton.formMethod = 'post'
    const confirmButtonText = document.createTextNode("Confirm Changes");
    confirmButton.appendChild(confirmButtonText);
    confirmButton.addEventListener('click', confirmChanges);
    profileDescription.appendChild(confirmButton);
   }
}

function editPassword(e){
    e.preventDefault();
    if (e.target.classList.contains("button")) {
       const profileDescription = document.querySelector('#profiledescriptioncontainer');
        while(profileDescription.firstChild){
           profileDescription.removeChild(profileDescription.firstChild);
        }
    }
}

function confirmChanges(e){
    e.preventDefault();
    if (e.target.classList.contains("button")) {
        console.log("clicked confirm");
        
        const newTruenameText = document.querySelector('#newtruename').value;
        if (newTruenameText != ""){
          userinfo.truename = newTruenameText;
        }

        const newPhoneText = document.querySelector('#newphone').value;
        if (newPhoneText != ""){
          userinfo.phone = newPhoneText;
        }

        const newEmailText = document.querySelector('#newemail').value;
        if (newEmailText != ""){
          userinfo.email = newEmailText;
        }

        const newBirthdayText = document.querySelector('#newbirthday').value;
        if (newBirthdayText != ""){
          userinfo.birthday = newBirthdayText;
        }

        const newAddressText = document.querySelector('#newaddress').value;
        if (newAddressText != ""){
          userinfo.address = newAddressText;
        }

        const newZipText = document.querySelector('#newzip').value;
        if (newZipText != ""){
          userinfo.zip = newZipText;
        }

        const newFurtherinfoText = document.querySelector('#newfurtherinfo').value;
        if (newFurtherinfoText != ""){
          userinfo.furtherinfo = newFurtherinfoText;
        }

        const profileDescription = document.querySelector('#profiledescriptioncontainer');
        while(profileDescription.firstChild){
           profileDescription.removeChild(profileDescription.firstChild);
        }
        addProfileDescription();
    }
}

function addInteractionHistory(){
    //will obtain the interaction activites of the account from an external server and display on the webpage
    const tableHeader = document.createElement('tr');
    const headerText = document.createTextNode("User Interactions History");
    tableHeader.appendChild(headerText);
    userInteractionList.appendChild(tableHeader);
    for (let i = 0; i < userinfo.interactions.length; i++){
      const interaction = document.createElement('tr');
      const text = document.createTextNode("Sold set A to Person X");
      interaction.appendChild(text);
      userInteractionList.appendChild(interaction);
    }

}
addInteractionHistory();

function uploadDataset(e){
    //will ask for a dataset from local storage and upload it to the external server and
    //record the interaction in the interaction history
    e.preventDefault();
    if (e.target.id == "uploaddataset") {
        const interaction = document.createElement('tr');
        const text = document.createTextNode("Uploaded a dataset");
        userinfo.interactions.push("Uploaded a dataset");
        interaction.appendChild(text);
        userInteractionList.appendChild(interaction);
    }
}

function changePassword(e){
    e.preventDefault();
    if (e.target.id == "changepassword") {
       const actionPanel = document.querySelector('#changepassordeleteprofile');
       while(actionPanel.firstChild){
         actionPanel.removeChild(profileDescription.firstChild);
       }
       const oldPassContainer = document.createElement('input');
       oldPassContainer.id = "oldpass";
       oldPassContainer.type = "text";
       oldPassContainer.placeholder = "enter old password here";
       actionPanel.appendChild(oldPassContainer);

       const newPassContainer = document.createElement('input');
       newPassContainer.id = "newpass";
       newPassContainer.type = "text";
       newPassContainer.placeholder = "enter new password here";
       actionPanel.appendChild(newPassContainer);

       const confirmButton = document.createElement('button');
       confirmButton.className = "button";
       const confirmButtonText = document.createTextNode("Confirm Changes");
       confirmButton.appendChild(confirmButtonText);
       confirmButton.addEventListener('click', passwordMatch);
       actionPanel.appendChild(confirmButton);
    }
}

function passwordMatch(e){
    e.preventDefault();
    if (e.target.classList.contains("button")) {
        const oldPassText = document.querySelector('#oldpass').value;
        if (oldPassText == userinfo.password){
          userinfo.password = document.querySelector('#newpass').value;
          document.querySelector('#oldpass').value = "new password confirmed";
          window.location.replace("./profileView.html", 200000)
        }
        else{
          document.querySelector('#oldpass').value = "password does not match";
        }
    }
}

function deleteProfile(e){
    e.preventDefault();
    if (e.target.id == "deleteprofile") {
       const actionPanel = document.querySelector('#changepassordeleteprofile');
       while(actionPanel.firstChild){
         actionPanel.removeChild(profileDescription.firstChild);
       }
       const confirmButton = document.createElement('button');
       confirmButton.className = "button";
       const confirmButtonText = document.createTextNode("Confirm Deletion?");
       confirmButton.appendChild(confirmButtonText);
       confirmButton.addEventListener('click', clearData);
       actionPanel.appendChild(confirmButton);
    }
}

function clearData(e){
   e.preventDefault();
   if (e.target.classList.contains("button")){
        userinfo.email = "";
        userinfo.password = "";
        userinfo.phone = "";
        userinfo.username = "";
        userinfo.truename = "";
        userinfo.birthday = "";
        userinfo.address = "";
        userinfo.zip = "";
        userinfo.profilepic ="";
        userinfo.interactions = [];
        userinfo.furtherinfo = "";
        const profileDescription = document.querySelector('#profiledescriptioncontainer');
        while(profileDescription.firstChild){
           profileDescription.removeChild(profileDescription.firstChild);
        }
        addProfileDescription();
        const nameSpace = document.querySelector('#profilepiccontainer');
        while(nameSpace.firstChild){
           nameSpace.removeChild(nameSpace.firstChild);
        }
        addUserName();
        while(userInteractionList.firstChild){
           userInteractionList.removeChild(userInteractionList.firstChild);
        }
   }
}

function setUser(user){
    loggedinuser = user

uploadDatasetButton.addEventListener('click', uploadDataset);
changePasswordButton.addEventListener('click', changePassword);
deleteProfileButton.addEventListener('click', deleteProfile);

module.exports = {
    setUser
}
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//will contain a list of datasets that will be obtained from the server in the final version
const datasetList = [];
const datapanel = document.querySelector("#datasetpanel");

const userinfo = {
    username: "This User",
    profilepic: "../assets/uoft.jpg",
    description: "email: thisuser@mail.com, phone: xxx-xxx-xxxx",
    interactions: ["Sold set A to Person X"]
}

function addDatasetsToSellList() {

    let listElement = document.createElement('div');
    listElement.className = "dataset"

    let pic = document.createElement('img');
    pic.className = "profilepic";
    pic.src = userinfo.profilepic;
    listElement.appendChild(pic);


    let datasetName = document.createElement('div');
    datasetName.className = "datasetName";
    datasetNameText = document.createTextNode("Dashcam Footage");
    datasetName.appendChild(datasetNameText);
    listElement.appendChild(datasetName);

    let datasetDetails = document.createElement('div');
    datasetDetails.className = "datasetDetails";
    datasetDetailsText1 = document.createTextNode("I am requesting minimum 10 hrs of labeled dashcam video...");
    datasetDetails.appendChild(datasetDetailsText1);

    listElement.appendChild(datasetDetails);
    listElement.addEventListener('click', redirectToInformationViewSell);

    datapanel.appendChild(listElement);

    listElement = document.createElement('div');
    listElement.className = "dataset"

    pic = document.createElement('img');
    pic.className = "profilepic";
    pic.src = userinfo.profilepic;
    listElement.appendChild(pic);


    datasetName = document.createElement('div');
    datasetName.className = "datasetName";
    datasetNameText = document.createTextNode("Local Weather");
    datasetName.appendChild(datasetNameText);
    listElement.appendChild(datasetName);

    datasetDetails = document.createElement('div');
    datasetDetails.className = "datasetDetails";
    datasetDetailsText1 = document.createTextNode("I am requesting local temperature, humidity, wind measurements...");
    datasetDetails.appendChild(datasetDetailsText1);

    listElement.appendChild(datasetDetails);
    listElement.addEventListener('click', redirectToInformationViewSell);

    datapanel.appendChild(listElement);

    listElement = document.createElement('div');
    listElement.className = "dataset"

    pic = document.createElement('img');
    pic.className = "profilepic";
    pic.src = userinfo.profilepic;
    listElement.appendChild(pic);


    datasetName = document.createElement('div');
    datasetName.className = "datasetName";
    datasetNameText = document.createTextNode("Fitness Tracker");
    datasetName.appendChild(datasetNameText);
    listElement.appendChild(datasetName);

    datasetDetails = document.createElement('div');
    datasetDetails.className = "datasetDetails";
    datasetDetailsText1 = document.createTextNode("I am requesting as many fitness logs as possible.");
    datasetDetails.appendChild(datasetDetailsText1);

    listElement.appendChild(datasetDetails);
    listElement.addEventListener('click', redirectToInformationViewSell);

    datapanel.appendChild(listElement);

}
addDatasetsToSellList();

function redirectToInformationViewSell(e) {
    //redirect to seller information page of the clicked dataset
    e.preventDefault();
    if (e.target.parentNode.className == "dataset") {
      console.log("clicked");
      window.location.replace("./commissionView.html");
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//template of a user whose info will be displayed for a buyer to contact and obtain access to the dataset
const userinfo = {
    username: "This User",
    profilepic: "../assets/uoft.jpg",
    description: "email: thisuser@mail.com, phone: xxx-xxx-xxxx",
    interactions: ["Sold set A to Person X"]
}

const request = require('request')

//will contain a list of datasets that will be obtained from the server in the final version
const datasetList = [];
const datapanel = document.querySelector("#datasetpanel");
//TODO:Node.js, however, is not browser Javascript. It is a server, much like PHP or Perl, and as such, you can't access the browser's DOM or do anything specific to browser-based Javascript.
//TODO:https://stackoverflow.com/questions/32126003/node-js-document-is-not-defined

//templates of datasets for phase one demo
const dataset1 = {
    submittinguser: userinfo,
    userpic: "../assets/uoft.jpg",
    name: "Oscillation records",
    description: "Records of CRO readings for various emissions"
}
const dataset2 = {
    submittinguser: userinfo,
    userpic: "../assets/uoft.jpg",
    name: "Soil Chemical readings",
    description: "Breakdown of soil chemicals from various regions"
}

//datasetList.push(dataset1);
//datasetList.push(dataset2);

function addDatasetsToBuyList(Datasets) {
    for (let i = 0; i < datasetList.length; i++){
        const listElement = document.createElement('div');
        listElement.className = "dataset"

        const pic = document.createElement('img');
        pic.className = "profilepic";
        pic.src = datasetList[i].image;
        listElement.appendChild(pic);


        const datasetName = document.createElement('div');
        datasetName.className = "datasetName";
        datasetNameText = document.createTextNode(datasetList[i].name);
        datasetName.appendChild(datasetNameText);
        listElement.appendChild(datasetName);

        const datasetDetails = document.createElement('div');
        datasetDetails.className = "datasetDetails";
        datasetDetailsText1 = document.createTextNode("Description: " + datasetList[i].description + '\n');
        datasetDetails.appendChild(datasetDetailsText1);
        let user;
        MongoClient.connect('mongodb://localhost:27017/StudentAPI', (error, client) => {
	if (error) {
		log("Can't connect to mongo server");
	} else {
		console.log('Connected to mongo server')
	}

	const db = client.db('StudentAPI')

	/// A 'select all' query to get all the documents
	// toArray(): promise based function that gives the documents
	db.collection('User').find({_id: datasetList[i].owner}).toArray().then((documents) => {
		user = documents
	}, (error) => {
		log("Can't fetch Datasets", error)
	})

	// Close the connection
	client.close();
})

        datasetDetailsText2 = document.createTextNode("Submitting User: " + user.email + '\n');
        datasetDetails.appendChild(datasetDetailsText2);
        datasetDetailsText3 = document.createTextNode("Contact info: " + datasetList[i].detail + '\n');
        datasetDetails.appendChild(datasetDetailsText3);

        listElement.appendChild(datasetDetails);
        listElement.addEventListener('click', redirectToInformationViewBuy);

        datapanel.appendChild(listElement);
    }
}
addDatasetsToBuyList();

function redirectToInformationViewBuy(e) {
    //redirect to buyers information page of the clicked dataset
    e.preventDefault();
    if (e.target.parentNode.className == "dataset") {
        console.log("clicked");
        window.location.replace("./databaseView")
    }
}


module.exports = {
    addDatasetstoBuyList
}

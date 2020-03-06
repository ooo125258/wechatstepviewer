/*jshint esversion: 6 */ 
/* jshint browser: true */ 

/* Users model */
const mongoose = require('mongoose');
const dataPerDate = require('./person').dataPerDate;
const userModel = require('./person').userModel;

const MongoClient = require('mongodb').MongoClient;
const {getPersonExists, getPerson, addPerson, deletePerson, personModification, updateDataPerDate, deleteDataPerDate, getPersonalFirstPageData} = require('./server_operations.js');
const dbOperations = require('./mongoose');

function emptyTest(client){
    const db = client.db("wholeData");
    db.getCollectionNames().forEach(function(collName){
        if (collName !== "groupName"){
            db.collection(collName).drop()
            .catch((error=>{
                console.log("Unable to Initialize the test: Unable to clear the database " + collName);
            }));
        }
    });
    console.log("EmptyTest Completed!");
}

function addPersonTest(client){
    //Notice: TODO: OPENID is not tested!
    const collection = client.db("wholeData").collection("userData");
    //Add a person:
    var d1 = new dataPerDate({'date':1566700451, 'steps': 10000});
    var d2 = new dataPerDate({'date':1566700475, 'steps': 12000});
    var d3 = new dataPerDate({'date':1566700481, 'steps': 13000});

    var userGroupNotExisted = {'name': 'person1', 'openID':0, 'wechatID': 'wechatIDne', 'stepData':[d1, d2], 'group':'groupNotExisted'};
    var user1 = {'name': 'person1', 'openID':1, 'wechatID': 'wechatID1', 'stepData':[d1, d2], 'group':'group1'};
    var user2 = {'name': 'person2', 'openID':2, 'wechatID': 'wechatID2', 'stepData':[d3], 'group':'group2'};
    var user1_SameNameDiffIDorGroup = {'name': 'person1', 'openID':3, 'wechatID': 'wechatID1_2', 'stepData':[d1, d2], 'group':'group3'};
    var user1_SameIDDiffNameorGroup = {'name': 'person1diff', 'openID':4, 'wechatID': 'wechatID1', 'stepData':[d1, d2], 'group':'group4'};
    var user1_sameIDGroup = {'name': 'person1diff', 'openID':5, 'wechatID': 'wechatID1', 'stepData':[d1, d2], 'group':'group1'};
    
    addPerson(client,user1).catch((error)=>{
        console.log("error insert2");
        console.log(error);
      });
    addPerson(client,user2).catch((error)=>{
        console.log("error insert2");
        console.log(error);
    });

    //Group not existed
    addPerson(client,userGroupNotExisted)
    .then((sth)=>{
        throw new Error("Error! userGroupNotExisted inserted!" + sth);
    }).catch((error)=>{
        console.log("Success! userGroupNotExisted! " + error);
    });

    addPerson(client,useuser1_sameIDGroupr2)
    .then((sth)=>{
        throw new Error("Error! user1_sameIDGroup inserted!" + sth);
    }).catch((error)=>{
        console.log("Success! user1_sameIDGroup! " + error);
    });

    addPerson(client,user1_SameIDDiffNameorGroup)
    .then((sth)=>{
        throw new Error("Error! user1_SameIDDiffNameorGroup inserted!" + sth);
    }).catch((error)=>{
        console.log("Success! user1_SameIDDiffNameorGroup! " + error);
    });

    addPerson(client,user1_SameNameDiffIDorGroup)
    .then((sth)=>{
        console.log("Success! user1_SameNameDiffIDorGroup! " + sth);
    }).catch((error)=>{
        throw new Error("Error! user1_SameIDDiffNameorGroup inserted!" + error);
    });

    console.log("addPersonTest Run and Completed!");
}

function getPersonTest(client){

}
function operation(client){
  const collection = client.db("wholeData").collection("userData");
  
  var d1 = new dataPerDate({'date':1566700451, 'steps': 10000});
  var d2 = new dataPerDate({'date':1566700475, 'steps': 12000});
  var d3 = new dataPerDate({'date':1566700481, 'steps': 13000});

  
  var user1 = new userModel({'name': 'person1', 'wechatID': 'wechatID1', 'stepData':[d1, d2], 'group':'group1'})
  var user2 = new userModel({'name': 'person2', 'wechatID': 'wechatID2', 'stepData':[d3], 'group':'group2'})
  collection.insertMany([user1, user2]).catch((error)=>{
    console.log("error insert2");
    console.log(error);
  });
}

//dbOperation('user01', 'password01', operation);

function operation2(client){
  return new Promise((resolve, reject)=>{
    const collection = client.db("wholeData").collection("userData");
    //var user1 = new userModel({'name': 'person1', 'wechatID': 'wechatID1', 'group':'group1'});
    var d1 = new dataPerDate({'date':1566700451, 'steps': 11000});
    var d2 = new dataPerDate({'date':1566700475, 'steps': 12000});
    var d3 = new dataPerDate({'date':1566700506, 'steps': 13000});
    let params = {'name': 'person1', 'wechatID': 'wechatID1', 'openID': 'openID5', 'group':'group1', 
    'pairs': [d1,d2,d3], 
    'dates': [1566700451, 1566700506]};
    //updateDataPerDate(client, params).then((result)=>{
    //  console.log('updateDataPerDate Done');
    //  console.log(result);
    // resolve(result);
    //}).catch((error)=>{reject(error);});
    updateDataPerDate(client, params).then((result)=>{
      console.log('deleteDataPerDate Done');
      console.log(result);
      console.log('The result is here: ' + JSON.stringify(result));
      resolve(result);
    }).catch((error)=>{reject(error);});
  });
 
}

function operation3(client){
  return new Promise((resolve, reject)=>{
    let params = {'name': 'person1', 'wechatID': 'wechatID1', 'openID': 'openID5', 'group':'group1',  
    'dates': [1566700451, 1566700506]};
    getPersonalFirstPageData(client, params).then((ret)=>{
      resolve(ret);
    }).catch((err)=>{
      reject("operation3 " +err);
    });
  });
}

function operation2(client){
  return new Promise((resolve, reject)=>{
    const collection = client.db("wholeData").collection("userData");
    //var user1 = new userModel({'name': 'person1', 'wechatID': 'wechatID1', 'group':'group1'});
    var d1 = new dataPerDate({'date':1566700451, 'steps': 11000});
    var d2 = new dataPerDate({'date':1566700475, 'steps': 12000});
    var d3 = new dataPerDate({'date':1566700506, 'steps': 13000});
    let params = {'name': 'person1', 'wechatID': 'wechatID1', 'openID': 'openID5', 'group':'group1', 
    'pairs': [d1,d2,d3], 
    'dates': [1566700451, 1566700506]};
    //updateDataPerDate(client, params).then((result)=>{
    //  console.log('updateDataPerDate Done');
    //  console.log(result);
    // resolve(result);
    //}).catch((error)=>{reject(error);});
    updateDataPerDate(client, params).then((result)=>{
      console.log('deleteDataPerDate Done');
      console.log(result);
      console.log('The result is here: ' + JSON.stringify(result));
      resolve(result);
    }).catch((error)=>{reject(error);});
  });
}
dbOperations('user01', 'password01', [emptyTest, addPersonTest]);


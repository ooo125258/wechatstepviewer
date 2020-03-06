/*jshint esversion: 6 */ 
/* jshint browser: true */ 

/* Users model */
const mongoose = require('mongoose');
const dataPerDate = require('./person').dataPerDate;
const userModel = require('./person').userModel;

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://user01:password01@testcluster-8lpn1.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
console.log('Yes!');
client.connect(err => {
    console.log('Yes2!');
    if (err) return console.log(err);
  const collection = client.db("wholeData").collection("userData");
  // perform actions on the collection object
  var d1 = new dataPerDate({'date':new Date(), 'steps': 10000})
  var d2 = new dataPerDate({'date':new Date(), 'steps': 12000})
  var d3 = new dataPerDate({'date':new Date(), 'steps': 13000})
  
  var user1 = new userModel({'name': 'person1', 'wechatID': 'wechatID1', 'stepData':[d1, d2], 'group':'group1'})
  var user2 = new userModel({'name': 'person2', 'wechatID': 'wechatID2', 'stepData':[d1, d3], 'group':'group2'})

  console.log('Yes3!');
  /*collection.insertOne(user1).catch((error)=>{
      console.log("error insert");
      console.log(error);
  });*/
  collection.insertMany([user1, user2]).catch((error)=>{
    console.log("error insert2");
    console.log(error);
  });

  client.close();
})

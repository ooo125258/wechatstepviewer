/*jshint esversion: 6 */ 
/* jshint browser: true */ 

/* Users model */
const mongoose = require('mongoose');
const dataPerDate = require('./person').dataPerDate;
const userModel = require('./person').userModel;

const MongoClient = require('mongodb').MongoClient;
const async = requre('async');
const {getPersonExists, getPerson, addPerson, deletePerson, personModification, updateDataPerDate, deleteDataPerDate, getPersonalFirstPageData} = require('./server_operations.js');/*
const uri = "mongodb+srv://user01:password01@testcluster-8lpn1.mongodb.net/test?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true });
console.log('Yes!');
MongoClient.connect(uri, { useNewUrlParser: true })
.then((client)=>{
  console.log('Yes2!');
    
  const collection = client.db("wholeData").collection("userData");
  // perform actions on the collection object
  var d1 = new dataPerDate({'date':new Date(), 'steps': 10000})
  var d2 = new dataPerDate({'date':new Date(), 'steps': 12000})
  var d3 = new dataPerDate({'date':new Date(), 'steps': 13000})
  
  var user1 = new userModel({'name': 'person1', 'wechatID': 'wechatID1', 'stepData':[d1, d2], 'group':'group1'})
  var user2 = new userModel({'name': 'person2', 'wechatID': 'wechatID2', 'stepData':[d3], 'group':'group2'})

  console.log('Yes3!');
  collection.insertOne(user1).catch((error)=>{
      console.log("error insert");
      console.log(error);
  });
  collection.insertMany([user1, user2]).catch((error)=>{
    console.log("error insert2");
    console.log(error);
  });

  client.close();
}).catch((error)=>{
  console.log("connection failed: " + error);
});
    */

function dbOperations(username, password, operations){
  //let uri = "mongodb://" + username + ":" + password + "@testcluster-shard-00-00-8lpn1.mongodb.net:27017,testcluster-shard-00-01-8lpn1.mongodb.net:27017,testcluster-shard-00-02-8lpn1.mongodb.net:27017/test?ssl=true&replicaSet=testCluster-shard-0&authSource=admin&retryWrites=true&w=majority";
  //let uri = "mongodb://" + username + ":" + password + "@testcluster-shard-00-00-8lpn1.mongodb.net:27017,testcluster-shard-00-01-8lpn1.mongodb.net:27017,testcluster-shard-00-02-8lpn1.mongodb.net:27017/test?ssl=true&replicaSet=testCluster-shard-0&authSource=admin&retryWrites=true&w=majority";
  let uri = "mongodb+srv://" + username + ":" + password + "@testcluster-8lpn1.mongodb.net/test?retryWrites=true&w=majority";
  console.log(uri);
  MongoClient.connect(uri, { useNewUrlParser: true })
  .then((db)=>{
    async.mapSeries(operations, function(operation, callback){
      operation(db).catch((error)=>{
        console.log('dbOperation operation failed: ' + error);
        return error;
      }).then((result)=>{
        console.log('operation successful');
        return result;
      });
      
      callback(null);
    }, function(err, results){
      console.log(results);
      db.close();
      if (err)throw new error(err);
    });
  })
  .catch((error)=>{
    console.log('dbOperation connection failed: ' + error);
    //TODO: 加入错误日志
    return error;
  })
  .finally(()=>{db.close();});
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
    /*
    let params = {'name': 'person1', 'wechatID': 'wechatID1', 'openID': 'openID5', 'group':'group1', 'pairs': [d1,d2,d3]};
    console.log(1);
    let a = 0;
    getPersonExists(client, params).then((result)=>{
      console.log('getPersonExists Done');
      console.log(result);
      resolve(result);
    }).catch((error)=>{reject(error);});
    getPersonExists(client, params).then((result)=>{
      console.log('getPersonExists Done');
      console.log(result);
    }).catch((error)=>{reject(error);});
    getPerson(client, params).then((result)=>{
      console.log('getPerson Done');
      console.log(result)
    }).catch((error)=>{reject(error);});*/
   /* deletePerson(client, params).then((result)=>{
      console.log('deletePerson Done');
      console.log(result);
    }).catch((error)=>{reject(error);});
    deletePerson(client, params).then((result)=>{
      console.log('deletePerson2 Done');
      console.log(result);
    }).catch((error)=>{reject(error);});
    */
    
  });
    /*
    addPerson(client, params)
    .then((result)=>{
      console.log('addPerson Done');
      resolve(result);
    })
    .catch((error)=>{
      if (error === false){
        console.log('here3?');
        reject('User Exists');
      }else{
        reject(error);
      }
      
    });
    //if (res === true){resolve(res);}else if (res === false){resolve(res);}else if (res === 'Error'){reject(res);}else{console.log('res');}
    //if (res === 'Error'){reject(res);}
    //else{resolve(res)}
    //resolve();
  });*/
 
  //let res = addPerson(client, params);
  //console.log(res);
  //console.log(2);
  /*
  console.log(addPerson(client, params));
  console.log(3);
  console.log(getPersonExists(client, params));
  console.log(4);
  console.log(getPerson(client, params));
  console.log(5);
  console.log(deletePerson(client, params));
  console.log(6);
  console.log(deletePerson(client, params));
  console.log(7);
  */
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
/*
dbOperation('user01', 'password01', 
  function (client){
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
      deleteDataPerDate(client, params).then((result)=>{
        console.log('deleteDataPerDate Done');
        console.log(result);
        console.log('The result is here: ' + JSON.stringify(result));
        resolve(result);
      }).catch((error)=>{reject(error);});
    });
});
*/
//dbOperation('user01', 'password01', operation3);

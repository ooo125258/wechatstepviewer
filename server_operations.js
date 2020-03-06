'use strict';
/*jshint esversion: 6 */ 
/* jshint browser: true */ 
const mongoose = require('mongoose');
const log = console.log;

const port = process.env.PORT || 3001;
const {dataPerDate, userModel} = require('./person');
const async = require('async');
function getPersonExists(client, params){
    /*
    访问数据库，是否有此人。
    警告：此处假定最多只存在一次。
    @param client: 数据库client，本次访问db: wholedata和collection：userData
    @param params: 该函数的参数。params.wechatID是查找项
    @return: promise: resolve(true), reject(false):不存在， reject(error):有错误
     */
    return new Promise((resolve, reject)=>{
        const collection = client.db("wholeData").collection("userData");
        let findPromise = collection.findOne({'wechatID':params.wechatID});
        findPromise.then((user)=>{
            //TODO: the code is so silly here.
            if (user){resolve(true);}else{console.log("Error: doesn't exists: " + params.wechatID);reject(false);}
        }).catch((error)=>{
            //TODO: there should be a log
            console.log("Error getPersonExists: ", error);
            reject(error);
        });
    });
}

function getPerson(client, params){
    /*
    访问数据库，返回此人.
    警告：此处假定最多只存在一次。
    @param client: 数据库client，本次访问db: wholedata和collection：userData
    @param params: 该函数的参数。params.openID是查找项
    @return: promise: resolve(user), reject(false):不存在， reject(error):有错误
     */
    return new Promise((resolve, reject)=>{
        const collection = client.db("wholeData").collection("userData");
        let findPromise = collection.findOne({'openID':params.openID});
        findPromise.then((user)=>{
            if (user){resolve(user);}else{reject(false);}
        }).catch((error)=>{
            //TODO: there should be a log
            reject(error);
        });
    });
}

function addPerson(client, params){
    /*
    访问数据库，如果存在此人，返回已存在。如果不存在此人，添加此人。同时建立此人的参数表。
    @param client: 数据库client，本次访问db: wholedata和collection：userData
    @param params: 该函数的参数。
        params.name:真实姓名
        params.wechatID:真实微信号
        params.openID:openid，由wechat关注之后生成
        params.group:所属群组
    @return promise: resolve(true), reject(false):已存在， reject(error):有错误
     */
    return new Promise((resolve, reject)=>{
        const collection = client.db("wholeData").collection("userData");
        let newUser = new userModel({
            'name': params.name, 
            'wechatID': params.wechatID, 
            'openID': params.openID, 
            'group':params.group
        });

        let findPromise = collection.findOne({'wechatID':params.wechatID});
        findPromise.then((user)=>{
            if (user){
                console.log('Error with addPerson: found this wechatID:' + params.wechatID);
                reject(false);
            }else{
                //现在加入新的人。
                collection.insertOne(newUser)
                .then((newUser)=>{
                    //加入新的走路记录表。
                    client.db("wholeData").createCollection(params.wechatID, (error, result)=>{
                        if (error){
                            console.log("Error when addCollection:" + error);
                            reject(error);
                        }else{
                            resolve(true);
                        }
                    });
                 
                })
                .catch((error)=>{
                    console.log("error addPerson");
                    console.log(error);
                    reject(error);
                });
            }
        }).catch((error)=>{
            console.log("error searching in addPerson");
            console.log(error);
            reject(error);
        });
    });
}

function deletePerson(client, params){
    /**
    *访问数据库，如果存在此人，删除此人。如果不存在此人，返回false。
    * @param client: 数据库client，本次访问db: wholedata和collection：userData
    * @param params: 该函数的参数。
    *    params.wechatID:真实微信号
    * @return true成功删除/false wechatID不存在/Error
     */
    const collection = client.db("wholeData").collection("userData");

    return new Promise((resolve, reject)=>{
        let findPromise = collection.findOneAndDelete({'wechatID':params.wechatID});
        findPromise.then((user)=>{
            console.log('The user is here: ' + user[0]);
            console.log(user[1]);
            collection.findOne({'wechatID':params.wechatID}).then((sth)=>{console.log("This is it: " + sth);})
            if (!user){//TODO: the "user" is always [object, object]. The question is on stackoverflow.
                console.log("Error with deletePerson: wechatID: " + params.wechatID);
                reject(false);
            }else{
                client.db("wholeData").dropCollection(params.wechatID, (error, result)=>{
                    if (error){
                        console.log("Error when deleteCollection, this guy might be deleted already: " + error);
                        reject(error);
                    }else{
                        console.log('Delete a person.');
                        resolve(true);
                        }
                    });
            }
        }).catch((error)=>{
            console.log("error deletePerson: "+ error);
            reject(error);
        });
    });
}

function updateDataPerDate(client, params){
    /**
     * Warning: we assume there is such a collection, no duplication and the input is correct!
     * upsertMethod. Load the time/step pairs and upsert to the collection
     * @param client: 数据库client，本次访问db: wholedata和collection：userData
     * @param params: 该函数的参数。
     *      params.wechatID
     *      params.pairs : [dataPerDate]
     * @return promise: resolve/reject
     */
    return new Promise((resolve, reject)=>{
        const collection = client.db("wholeData").collection(params.wechatID);
        console.log(params.pairs);

        //Define bulkUpdate
        const bulkUpdateOps = params.pairs.map((doc)=>{
            return{
                "updateOne":{
                    "filter":{"date":doc.date},
                    "update": { "$set": { "steps": doc.steps} },
                    "upsert": true
                }
            };
        });
        collection.bulkWrite(bulkUpdateOps, (error, result)=>{
            if (error){
                reject(error);
            }else{
                resolve(result);
            }
        });
    });
}

function deleteDataPerDate(client, params){
    /**
     * Warning: we assume the dates are all Wechat Dates!
     * delete dataPerDate for all date specified
     * @param client: 数据库client，本次访问db: wholedata和collection：userData
     * @param params: 该函数的参数。
     *      params.wechatID
     *      params.dates : [dates]
     *          'dates': [1566700451, 1566700506]
     */

    return new Promise((resolve, reject)=>{

        const collection = client.db("wholeData").collection(params.wechatID);
        console.log(params.dates)
        const bulkUpdateOps = params.dates.map((doc)=>{
            return{
                "deleteMany":{
                    "filter":{"date":doc},
                }
            };
        });
        collection.bulkWrite(bulkUpdateOps, (error, result)=>{
            if (error){
                reject("deleteDataPerDate: " + error);
            }else{
                //TODO: bulkwrite will ignore if the deletion is failed.
                resolve(result);
            }
        });
    });
}


function getPersonalFirstPageData(client, params){
    /**
     * Warning: we assume the user is allowed to do this operation!
     * return json, the steps for today, this week and this month。
     * 
     * TODO: should I save the today's data? Currently I wont. However, it might be better to set up a "current date" and "current personal firstpage data"
     * TODO: what happened if failed? doesn't find value?
     * TODO: Warning! Time issue! The date I transferred is later than the current time???
     * { todayStep: 11000, weeklyStep: 21000, monthlyStep: 42000 }
     */
    return new Promise((resolve, reject)=>{

        const collection = client.db("wholeData").collection(params.wechatID);
        //TODO: Warning: The bound of the time range!!
        var a = {};//personalFirstPageData.todayStep
        var b = {};
        var c = {};
        helper_getTS()//Todo: change then.then.then to async.series.
        .then((ts)=>{
            async.parallel([
                function(callback) {
                    collection.findOne({"date": ts.todayTS})
                    .then((data)=>{
                        console.log("Today " + data.steps);
                        callback(null, data.steps);
                    }).catch((err)=>{callback(err,null);})
                },
                function(callback) {
                    collection.find({"date" : {"$lte" : ts.todayTS, "$gte" : ts.mondayTS}}).toArray((err, weeklyDataPerDateSet)=>{
                        if (err){callback("getPersonalFirstPageData findweekly return "+ err, null);}
                        else{
                            console.log("week");
                            console.log(weeklyDataPerDateSet);
                            sumFields(weeklyDataPerDateSet).then((result)=>{
                                console.log("Test:");
                                console.log(result);
                                callback(null, result);
                                //console.log(personalFirstPageData);
                            }).catch((error)=>{callback("GetPersonalFirstPageData findweekly" + error, null);});
                        }
                    });
                },
                function(callback) {
                    collection.find({"date" : {"$lte" : ts.todayTS, "$gte" : ts.firstDayTS}}).toArray((err, monthlyDataPerDateSet)=>{
                        if (err){console.log(err);reject("getPersonalFirstPageData findmonthly return"+ err);}
                        else{
                            console.log("month");
                            console.log(monthlyDataPerDateSet);
                            sumFields(monthlyDataPerDateSet).then((result)=>{
                                callback(null, result);
                            }).catch((error)=>{reject("getPersonalFirstPageData findmonthly"+ error);});
                        }
                        console.log('execute here?');
                    });
                }
            ],
                // optional callback
            function(err, results) {
                if (err){reject(err);}
                // the results array will equal ['one','two'] even though
                // the second function had a shorter timeout.
                let getPersonalFirstPageData = {"todayStep" : results[0], "weeklyStep" : results[1], "monthlyStep" : results[2]};
                resolve(getPersonalFirstPageData);
            });
        }).catch((err)=>{reject(err);});
    });   
}

function GetTotalRank(client, params){
    /**
     * Get the Rank of Everyone, Given specific BeginTS.
     */
    return new Promise((resolve, reject)=>{

        let i = 0;
        const collection = client.db("wholeData").collection("userData");
        var funcList = [];
        helper_getTS()
        .then((ts)=>{//Check if async can use promise instead of Callback
            var eachParams = {"beginTS": params.beginTS, "endTS": ts.todayTS};
            let userList = collection.find({}, "wechatID").toArray((err, userList)=>{
                //Userlist: [{"_id":..., "wechatID":...}]
                if (err){
                    reject("GetTotalRank " + err);
                }
                console.log(userList);
                async.eachOf(userList, function(wechatJSON, callback){
                    eachParams.wechatID = wechatJSON.wechatID;
                    callback(null, helper_getPersonSteps.bind(null, client, eachParams));
                }, function(err, results){
                    if (err){reject("GetTotalRank async each wechatJSON" + err);}
                    
                    async.parallel(results, function(err, results){
                        //results is sum, matching userList
                        if (err){reject("GetTotalRank async parallel" + err);}
                        console.log(results);
                        resolve(results);
console.                    });
                });
                /*for (i = 0; i < userList.length; i++){
                    eachParams.wechatID = userList.wechatID;
                    //Construct the parallel list
                    funcList.push(helper_getPersonSteps.bind(null, client, eachParams));
                }*/
            });

        });
        
    });
    
}

function helper_getPersonSteps(client, params, callback){
    /**
     * not a promise function. Please use with bind. Have a callback.
     * Get the steps between beginTS and endTS, including.
     * Use wechatID, from startTS to endTS
     */
    const collection = client.db("wholeData").collection(params.wechatID);
    collection.find({"date" : {"$lte" : params.endTS, "$gte" : params.beginTS}}).toArray((err, DataPerDateSet)=>{
        if (err){callback("helper_getPersonSteps "+ err, null);}
        else{
            sumFields(DataPerDateSet).then((result)=>{
                console.log("Test:");
                console.log(result);
                callback(null, result);
                //console.log(personalFirstPageData);
            }).catch((error)=>{callback("helper_getPersonSteps " + error, null);});
        }
    });
}

function refreshTheGroupRank(client, params, callback){
    /**
     * get the result with order, aggregation.
     * The steps from today to specific date params.beginTS - params.endTS for person params.wechatID
     */
    const collection = client.db("wholeData").collection(params.wechatID);
    collection.find({"date" : {"$lte" : params.todayTS, "$gte" : params.beginTS}}).toArray((err, DataPerDateSet)=>{
        if (err){callback("getPersonalFirstPageData return "+ err, null);}
        else{
            console.log(DataPerDateSet);
            sumFields(DataPerDateSet).then((result)=>{
                callback(null, result);
                //console.log(personalFirstPageData);
            }).catch((error)=>{callback("GetPersonalFirstPageData findweekly" + error, null);});
        }
    });
}


function helper_getTS(){
    /**
     * Return an integer timestamp for today. Unix time
     * for example: { todayTS: 1567310400,
        mondayTS: 1566792000,
        firstDayTS: 1567310400 }
     */
    //Today timestamp Is this today or Tomorrow???
    //TODO: reject?
    return new Promise((resolve, reject)=>{
        //try{
            let today = new Date(new Date().toLocaleDateString("en-US", {timeZone: "Asia/Shanghai"}));
            let todayTS = today.getTime() / 1000;
            //TODO: 微信到底是前面多少位？这是unix时间吧？

            //monday TS
            var day = today.getDay() || 7; // Get current day number, converting Sun. to 7
            let monday = new Date(today);
            if( day !== 1 )                // Only manipulate the date if it isn't Mon.
                monday.setHours(-24 * (day - 1));   // Set the hours to day number minus 1
                                                //   multiplied by negative 24
            let mondayTS = monday.getTime() / 1000;

            //1st day in month ts
            let firstDay = new Date(today);
            firstDay.setDate(1);
            let firstDayTS = firstDay.getTime() / 1000;
            console.log({todayTS, mondayTS, firstDayTS});
            resolve({todayTS, mondayTS, firstDayTS});
        //}catch(error){
        //    reject("getTS " + error);
        //}
    });
}


function personModification(client, params){
    /*
    警告：微信端前台不会进行此操作。
    访问数据库，如果存在此人，修改此人。
    
     */
    const collection = client.db("wholeData").collection("userData");
    let findPromise = collection.findOneAndUpdate({
        $inc:{
        'name': params.newName, 
        'wechatID': params.newWechatID, 
        'openID': params.newOpenID, 
        'group':params.newGroup
        }})
        .where('wechatID', params.wechatID);
    findPromise.then((user))

}


//Helper function:
function sumFields(dataPerDateSet){
    /**
     * TODO: search online later. 
     * sum all json with same field.
     */
    return new Promise((resolve, reject)=>{
        try{
            if (dataPerDateSet && dataPerDateSet.length != 0){
                let i = 0;
                let rst = 0;
                for (i = 0; i < dataPerDateSet.length; i++){
                    rst += dataPerDateSet[i].steps;
                }
                resolve(rst);
            }else{
                resolve(0);
            }
        }catch(error){
            reject(error);
        }
    });
}


module.exports = {
    getPersonExists,
    getPerson,
    addPerson,
    deletePerson,
    updateDataPerDate,
    personModification,
    deleteDataPerDate,
    getPersonalFirstPageData
};
//export const getPersonExists = () => {};
//export const getPerson = () => {};
//export const addPerson = () => {};
//export const deletePerson = () => {};
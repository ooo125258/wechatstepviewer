/*jshint esversion: 6 */ 
/* jshint browser: true */ 

/* Users model */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const dataSchema = new mongoose.Schema({
    date: Number,
    steps:Number
    });

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    wechatID:{type:String, required:true, unique:true},
    openID:{type:String, required:true, unique:true},
    /*wechatName:{type:String, required:true},*/
    stepData: [dataSchema],
    group: {type: String, required: true},//TODO: 用数组好呢？还是用string操作好呢？
    session_key: String
});


const dataPerDate = mongoose.model('dataPerDate', dataSchema);
const userModel = mongoose.model('userModel', userSchema);

userSchema.pre('save', (next)=>{
    //const user = this;
    console.log('this!');
    console.log(this);
    userModel.findOne({'wechatID' : this.wechatID}, (err, user)=>{
        if (error){
            console.log('checking Failure');
        }
        if (user){
            console.log('User wechatID exists!');
        }else{

            next();
        }
    });
});

module.exports = {dataPerDate, userModel};
//jshint esversion:6
'use strict';
const log = console.log;

import express from 'express';
import formidableMiddleware from 'express-formidable';
const port = process.env.PORT || 3001
import session from 'express-session';
import hbs from 'hbs';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

//Requiring scripts of each page
//const browsingViewBuy = require('./browsingViewBuyScript')//TODO, this is local
//const profileView = require('./profileView')

const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./db/mongoose');

// Import the models
const { Dataset } = require('./models/dataset')
const { Request } = require('./models/request')
const { User } = require('./models/user')

const path = require('path');

// express
const app = express();

//小程序信息：
let wechatAppId = "abcd";
let wechatSecret = "secret";
let dbUserName = 'user01';
let dbUserPass = 'password01';
// body-parser middleware setup.
//app.use(formidableMiddleware({uploadDir: __dirname + "/assets"}));//+ "/assets"

// set the view library
//app.set('view engine', 'hbs')

// static directory
//app.use(express.static(__dirname + "/assets"))//
//app.use(express.static(__dirname ))//+ "/assets"
/*
const userExists = (req, res, next) =>{
    if (req.wechatID){
        User.find({"wechatID": req.wechatID})
            .then((user)=>{
                if (!user){return Promise.reject('Not Found');}
                else{next();}
            }).catch((error)=>{
                return Promise.reject('Error');})
    } else {
        return Promise.reject('wechatID Null');
    }
}
*/
//TODO:现在不需要session或者cookie。只要微信登上了，就一直有效

const sessionChecker = (req, res, next) =>{
    //现在先不管
    console.log('session Checker.');
    next();
}

app.route('/', (req, res)=>{
    res.redirect('/login')
});
app.route('/login')
    .get((req, res)=>{
        //如果是get方法，直接导入qrcode页面，准备载入
        res.render(__dirname + '/qrcodeLogin.hbs');//TODO
    }).post(sessionChecker, async (req, res)=>{
        var {code, type} = req.body;
        if (type !== 'wxapp'){
            //非微信登陆，暂时不考虑,debug用
            //res.render(__dirname + '/useWechatPlease.hbs');//TODO
            //return;
            console.log(code);
            params = {};
            //sessionChecker exists, so login to first page directly.
            //Update steps from user, return the personal step data, refresh the group rank
            dbOperation(dbUserName, dbUserPass, function(client){
                return new Promise((resolve, reject)=>{
                    //get update step data from code.
                    params.pairs = code.pairs;
                    updateDataPerDate(client, params)
                    .then((result)=>{
                        //DEBUG
                        console.log('login, update, Done');
                        console.log(result);
                        console.log('The result is here: ' + JSON.stringify(result));
                        //resolve(result);
                        
                        //return the personal step data
                        params.wechatID = code.wechatID;
                        let firstPage = getPersonalFirstPageData(client, params);
                        //TODO: return to wechat page
                        res.send(JSON.stringify(firstPage));
                        

                        //refresh the group rank
                        //TODO: push to the free time operation if possible
                        refreshTheGroupRank(client, params);
                    }).catch((error)=>{reject(error);});
                });


            });

            
            
        }
        axios.get('https://api.weixin.qq.com/sns/jscode2session', {
            params:{
                appid: wechatAppId,
                secret: wechatSecret,
                js_code: code,
                grant_type: 'authorization_code'

            }
        }).then(({data})=>{
            let openID = data.openid;
            let session_key = data.session_key;

            //此处登录数据库，试图查找此人，如果没查到就加人
            let return_message = dbOperation('login', 'login', getPersonExists);
            if (return_message === 'Error'){
                //TODO:Error handler
            }else if (return_message === true){
                //TODO:存在此人，直接登录
            }else{
                //TODO:不存在此人，准备注册。
            }

            req.session.openID = data.openID;
            //TODO: 把user存在req里？
        })
        //试图进行登陆，已经通过wx.request发送数据
        /*
        let {js_code} = req.body;
        let opts = {
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`
          }
        let r1 = await promiseReq(opts);
        console.log(r1);
        res.json(r1);
      */
    });


/**
     * promise化request
     * @param {object} opts 
     * @return {Promise<[]>}
     */
function promiseReq(opts = {}){
	return new Promise((resolve, reject) => {
	    request(opts, (e, r, d) => {
		if (e) {
		    return reject(e);
		}
	        if (r.statusCode != 200) {
		    return reject(`back statusCode：${r.statusCode}`);
		}
		return resolve(d);
	    });
	})
    };

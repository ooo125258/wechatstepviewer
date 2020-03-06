/* server.js nov19 - 3pm */
'use strict';
const log = console.log;

const express = require('express')
const formidableMiddleware = require('express-formidable');
const port = process.env.PORT || 3001
const session = require('express-session')
const hbs = require('hbs')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')

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
// body-parser middleware setup.
app.use(formidableMiddleware({uploadDir: __dirname + "/assets"}));//+ "/assets"

// set the view library
app.set('view engine', 'hbs')

// static directory
app.use(express.static(__dirname + "/assets"))//
app.use(express.static(__dirname ))//+ "/assets"

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))

// Add middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	log("asdf")
	if (req.session.user) {
		res.redirect('/profileView')
	} else {
		next();
	}
}

// Middleware for authentication for resources
const authenticate = (req, res, next) => {
	log(req.session.user)
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				next()
			}
		}).catch((error) => {
			res.redirect('/login')
		})
	} else {
		res.redirect('/login')
	}
}

// route for root; redirect to login

app.get('/', sessionChecker, (req, res) => {
	res.redirect('/login')
})

// login
app.route('/login')
	.get(sessionChecker, (req, res) => {
		log('got route')
		res.render(__dirname + '/login.hbs', {"message": ""})
	})


app.post('/login', sessionChecker, (req, res) => {
	const email = req.fields.email
	const password = req.fields.password
	log('entered /users/login')
	log(req.fields)
	User.findByEmailPassword(email, password).then((user) => {
		req.session.user = user._id;
		req.session.email = user.email
		res.redirect('/profileView')
	}).catch((error) => {
		if (!error) {
			User.findOne({"email": email}, function(err, user){
				if (err || !user){
					res.render(__dirname + '/login.hbs', {"message":
					"Unpaired email and password."})
				}else{
					if (password === user.resetToken){
						req.session.user = user._id;
						req.session.email = user.email
						user.resetToken =null
						user.resetDate = null
						res.redirect('/changePassword')
					}else{
						res.render(__dirname + '/login.hbs', {"message":
						"Status incorrect. Email not found?"})
					}
				}
			})/*.then((user) => {
				if (password === user.resetToken){
					req.session.user = user._id;
					req.session.email = user.email
					user.resetToken =null
					user.resetDate = null
					res.redirect('/changePassword')
				}else{
					res.render(__dirname + '/login.hbs', {"message":
					"Unpaired email and password."})
				}
			}).catch((error)=>{
				res.render(__dirname + '/login.hbs', {"message":
					"Unpaired email and password."})
			})*/

		} else {
			log(error)
			res.status(400).render(__dirname + '/login.hbs', {"message":
			error.message})
		}
	})
})

// logout
app.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

// registration
app.get('/registration', sessionChecker, (req, res) => {
	res.render(__dirname + "/registration.hbs", {"message": ""})
})

app.post('/registration', sessionChecker, (req, res) =>{
	log(req.fields)
	const email = req.fields.email
	const password = req.fields.password
	if (!(email && password)){
		log('no email or password')
		res.render(__dirname + '/registration.hbs', {"message": "Enter an email and password."})
	} else if (password.length < User.schema.paths.password.options.minlength) {
		log(password.minlength)
		res.render(__dirname + '/registration.hbs',
				{"message": "Your password must be at least 6 characters long."})
	} else {
		User.findOne({"email": email}).then((user) => {
			log('find if user existed')
			log(user)
			if(!user) {//Found an user, return error?
				const newUser = new User({
					email: req.fields.email,
					password: req.fields.password,
					nickname: req.fields.nickname,
					phone: req.fields.phone,
					truename: req.fields.truename,
					birthday: req.fields.birthday,
					address: req.fields.address,
					zip: req.fields.zip,
					power: 'user',
					profile_description: "email: "+ req.fields.email + "\nTrue name:" + req.fields.truename,
					profile_pic_src: "default_profile_pic.png",
					resetToken: null,
					resetDate : null

				})
				log('newUser')
				log(newUser)
				// save user to database
				newUser.save().then((result) => {
					log('regis succeed?')
					log(result)
					res.render(__dirname + '/login.hbs',
							{"message": "<t style=\"color:green\"> Success </t>"})
				}, (error) => {
					res.render(__dirname + '/registration.hbs',
							{"message": error.message})
				})
			} else {
				res.render(__dirname + '/registration.hbs',
						{"message": "A user with this email already exists."})
			}
		}).catch((error) => {
			res.render(__dirname + '/registration.hbs',
					{"message": error.message})
		})
	}
})


//Profile user
app.get('/profileView', authenticate, (req, res) => {
	log('enter')
	log(req.fields)
	const user_id = req.session.user // the id is in the req.params object
	const email = req.session.email
	// Good practise is to validate the id
	log(user_id)
	if (!ObjectID.isValid(user_id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	log('not 404')
	User.findById(user_id, function(err, user){
		if (err){
			log('ok, err')
			log(err)
			res.status(400).send(error)
		}
		else if (user){
			log('hooray!')
			log('we found')

			log('returning')
			res.render(__dirname + '/profileView.hbs',
					{"profile_pic_src": user.profile_pic_src,
					"profile_description": user.profile_description,
					newphone: user.phone,
					newaddress: user.address,
					newbirthday: user.birthday,
					newemail: user.email,
					newzip: user.zip,
					newnickname: user.nickname,
					newtruename: user.truename,
					newfurtherinfo: user.profile_description
					})

		}else{
			res.status(400).send('unknown')
		}


	})/*.then((user) => {
		log('we found')
		if (!user) {
			log('404 fubakkt')
			res.status(404).send()
		} else {
			log('returning')
            res.render(__dirname + '/profileView.hbs',
					{"profile_pic_src": user.profile_pic_src,
					 "profile_description": user.profile_description,
					 newphone: users.phone,
					 newaddress: users.address,
					 newbirthday: users.birthday,
					 newemail: users.email,
					 newzip: users.zip,
					 newnickname: user.nickname,
					 newtruename: user.truename,
					newfurtherinfo: user.profile_description
					})
		}

	}).catch((error) => {
		log('another error?')
		res.status(400).send(error)
	})*/
})

app.post('/changeUserInfo', authenticate, (req, res) => {
	const email = req.fields.email
	const password = req.fields.password
	log('entered /users/profileView')
	log(req.fields)
	User.findById(req.session.user).then((user) => {
		log('found!')
		req.session.user = user._id;
		req.session.email = user.email

		//updating user values
		user.update({$set: {phone: req.fields.newphone, address: req.fields.newaddress, birthday: req.fields.newbirthday,
		email: req.fields.newemail, zip: req.fields.newzip, profile_description: req.fields.newfurtherinfo, nickname: req.fields.newnickname,
		truename: req.fields.newtruename, profile_pic_src:path.basename(req.files.profile_pic.path)}}, {new: true}).then((status) => {
						if (!status) {
							res.status(404).send()
						} else {
							log('user values updated')
							res.render(__dirname + '/profileView.hbs', {"message":
					"Value updated!",
					"profile_description": req.fields.profile_description,
					newphone: req.fields.newphone,
					newaddress: req.fields.newaddress,
					newbirthday: req.fields.newbirthday,
					newemail: req.fields.newemail,
					newzip: req.fields.newzip,
					newnickname: req.fields.newnickname,
					newtruename: req.fields.newtruename,
					newfurtherinfo: req.fields.profile_description,
					profile_pic_src: path.basename(req.files.profile_pic.path)})
						}
					}).catch((error) => {
						log('resource fetch error')
						res.status(400).send(error)
					})

	}).catch((error) => {
		if (!error) {
			res.render(__dirname + '/login.hbs', {"message":
					"Unpaired email and password."})
		} else {
			log(error)
			res.status(400).render(__dirname + '/login.hbs', {"message":
			error.message})
		}
	})
})

app.post("/editProfile", authenticate, (req, res) => {
	description = req.fields.profile_description
	log("description" + description)

	User.findBypdate({$set:{profile_description: description}}, {new:true}).then((status)=>{
		if (!status) {
			res.status(404).send()
		} else {
			log('user values updated')
		}
	})
})

app.get("/uploadDataset", authenticate, (req, res) => {
	res.render(__dirname + "/uploadDataset.hbs",
			{"message": ""})
})

app.get("/uploadRequest", authenticate, (req, res) => {
	res.render(__dirname + "/uploadRequest.hbs",
			{"message": ""})
})

app.post("/uploadDataset", authenticate, (req, res) => {
	if (!(req.fields.title && req.fields.description && req.fields.price)) {
		res.render(__dirname + "/uploadDataset.hbs",
				{"message": "Please fill out the necessary fields."})
	} else {
		log(req.fields)
		const new_dataset = new Dataset({
			title: req.fields.title,
			owner: req.session.user,
			description: req.fields.description,
			price: req.fields.price,
			main_image: path.basename(req.files.main_image.path),
			comp_image_1: path.basename(req.files.comp_image_1.path),
			comp_image_2: path.basename(req.files.comp_image_2.path),
			comp_image_3: path.basename(req.files.comp_image_3.path),
			size: "UNKNOWN",
			credibility: "UNKNOWN",
			quality: "UNKNOWN",
		})
		log(new_dataset)
		new_dataset.save().then((dataset) => {
			log("this dataset")
			log(dataset)
			User.findOneAndUpdate({"_id":dataset.owner},
					{$push: {"datasets":dataset._id}}
				).then((user) => {
					log(user)
				}).catch((error) => {
					log("asdfadsasdf")
					res.status(400).send(error)
				})
		}).catch((error) => {
			log("asdfadsasdf")
			res.status(400).send(error)
		})
		res.render(__dirname + "/uploadDataset.hbs",
				{"message": "<span style=\'color:green\'> Success </span>"})
	}
})

app.post("/uploadRequest", authenticate, (req, res) => {
	if (!(req.fields.title && req.fields.description && req.fields.price)) {
		res.render(__dirname + "/uploadRequest.hbs",
				{"message": "Please fill out the necessary fields."})
	} else {
		log(req.fields)
		const new_request = new Request({
			title: req.fields.title,
			owner: req.session.user,
			description: req.fields.description,
			price: req.fields.price,
			main_image: path.basename(req.files.main_image.path),
			comp_image_1: path.basename(req.files.comp_image_1.path),
			comp_image_2: path.basename(req.files.comp_image_2.path),
			comp_image_3: path.basename(req.files.comp_image_3.path),
			size: "UNKNOWN",
			credibility: "UNKNOWN",
			quality: "UNKNOWN",
		})
		log(new_request)
		new_request.save()
		res.render(__dirname + "/uploadRequest.hbs",
				{"message": "<span style=\'color:green\'> Success </span>"})
	}
})

app.get('/browsingViewBuy', authenticate, (req, res) => {//TODO: add authenticate
	// Add code here
	Dataset.find().then((databases) => {
		log("asdf")
		res.render(__dirname + '/browsingViewBuy.hbs', {"databases":databases})
	})
})

app.get('/browsingViewSell', authenticate, (req, res) => {//TODO: add authenticate
	// Add code here
	Request.find().then((requests) => {
		log("asdf")
		res.render(__dirname + '/browsingViewSell.hbs', {"requests":requests})
	})
})

app.get("/:id", authenticate, (req, res) => {//TODO: add authenticate
	const id = req.params.id
	Dataset.findById(id).then((information) => {
		res.render(__dirname + '/detailedView.hbs', {"information":information})
	}).catch((error) => {
		Request.findById(id).then((information) => {
			res.render(__dirname + '/detailedView.hbs', {"information":information})
		}).catch((error) => {
			res.status(404).send()
		})
	})
})

app.get('/forgetPassword', (req,res)=>{
	res.render(__dirname + '/forgetPassword.hbs', {"message": ""})

})
app.post('/forgetPassword', (req,res)=>{
	log('get forgetpass')
	log(req.fields)
	log('where is it?')
	const email = req.fields.email
	log('where it is?')

	log(req.fields.email)
	User.findOne({"email": email}, function(err, user){
		if (err){
			console.log('I didnt find it')
			console.log(user)
			res.render(__dirname + '/forgetPassword.hbs', {message:"no such user!"})
		}
		else if (user){
			bcrypt.genSalt(10, (error, salt) => {
				bcrypt.hash(user.password, salt, (error, hash) => {
					const token = hash

						//Update secure Token
					user.update({$set: {resetToken: token, resetDate: new Date()}}, {new: true}, function(err, status){
						if (err){
							res.status(404).send()
						}
						else if (status){
							log('st correct')
							let transporter = nodemailer.createTransport({

								// host: 'smtp.ethereal.email',
								service: 'Gmail', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
								port: 465, // SMTP 端口
								secureConnection: true, // 使用了 SSL
								auth: {
								  user: 'csunformal@gmail.com',
								  // 这里密码不是qq密码，是你设置的smtp授权码
								  pass: 'Sunchuanqi0',
								}
							});

							let mailOptions = {

								from: '"server" <csunformal@gmail.com>', // sender address

								to: email, // list of receivers

								subject: 'server, reset password', // Subject line

								// 发送text或者html格式

								// text: 'Hello world?', // plain text body

								html: token  // html body

							};
							// send mail with defined transport object

							transporter.sendMail(mailOptions, (error, info) => {
								if (error) {
									log('sending email error')
									log(error)
									//res.status(400).send(error)
								}
								log('here!!')
								console.log('Message sent: %s', info.messageId);
								//res.render(__dirname + '/login.hbs', {message:"an password reset email has been sent to ${email}."})
							}).catch((error) => {
									log('send failed')
									//res.status(400).send(error)
							})
						}else{
							log('why you are here?')
						}
					})/*.then((status) => {
						if (!status) {
							res.status(404).send()
						} else {
							log('secure token reset')

							//send email

							let transporter = nodemailer.createTransport({

								// host: 'smtp.ethereal.email',
								service: 'Gmail', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
								port: 465, // SMTP 端口
								secureConnection: true, // 使用了 SSL
								auth: {
								  user: 'csunformal@gmail.com',
								  // 这里密码不是qq密码，是你设置的smtp授权码
								  pass: 'Sunchuanqi0',
								}
							});

							let mailOptions = {

								from: '"server" <csunformal@gmail.com>', // sender address

								to: email, // list of receivers

								subject: 'server, reset password', // Subject line

								// 发送text或者html格式

								// text: 'Hello world?', // plain text body

								html: token  // html body

							};
							// send mail with defined transport object

							transporter.sendMail(mailOptions, (error, info) => {
								if (error) {
									log('sending email error')
									log(error)
									//res.status(400).send(error)
								}
								log('here!!')
								//console.log('Message sent: %s', info.messageId);
								//res.render(__dirname + '/login.hbs', {message:"an password reset email has been sent to ${email}."})
							}).catch((error) => {
									log('send failed')
									//res.status(400).send(error)
							})



						// Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
						}
					  });*/
				})
			})
		}else{
			res.status(404).send('unknown error')
		}
	})
	User.findOne({"email": email}).then((user) =>{
		if (!user) {

		}else{





		}


	}).catch((error) => {
		log('Why? impossible!')
		res.render(__dirname + '/forgetPassword.hbs', {message:"no such user?"})
	})
	//res.redirect('/changePassword')
})

app.get('/changePassword', authenticate, (req,res)=>{
	log('get changepass')
	res.render(__dirname + "/changePassword.hbs", {"message": ""})
})

app.post('/changePassword', authenticate, (req,res) =>{
	//TODO: Actually it should use a special authenticate here.

	//If logged in, then yes. If from email, also yes!
	log(req.fields)
	const email = req.fields.email
	const newPassword1 = req.fields.newpassword1
	const newPassword2 = req.fields.newpassword2

	if (email !== req.session.email){
		log("new password mismatch")
		res.render(__dirname + '/changePassword.hbs', {message:"This is not your account!"})
	}
	if (newPassword1 !== newPassword2){
		log("new password mismatch")
		res.render(__dirname + '/changePassword.hbs', {message:"new passwords mismatch!"})
	}else if(newPassword1.length < User.schema.paths.password.options.minlength){
		log('password len?')
		res.render(__dirname + '/changePassword.hbs', {message:"password must be more than 6 characters."})
	}else{
		log('pos here ')
		User.findOne({"email":email}).then((user) => {
			if(!user){//I think it would be
				log('you didnt find the user')
				res.render(__dirname + '/changePassword.hbs', {message:"No such user!"})
			}else{//we found user

				user.update({$set: {password: newPassword1}}, {new: true}).then((status) => {
					if (!status) {
						res.status(404).send()
					} else {
						log('you changed it!')
						if (req.session.user) {
							log('you logged in. go back')
							res.redirect('/profileView')
						} else {
							log('you can login now')
							res.render(__dirname + '/login.hbs', {"message":
					"You've just changed a password!"})
						}

					}
				}).catch((error) => {
					log('password update failed')
					res.status(400).send(error)
				})

			}
		})
	}
})



app.get('/super_user/whosyourdaddy/uuddlrlrba', (req, res)=>{
	//Use only once!!!!!!
	//Add an super user
	const superUser = new User({
		email: 'admin@gmail.com',
		password: 'adminpassword',
		nickname: null,
		phone: null,
		truename: null,
		birthday: null,
		address: null,
		zip: null,
		power: 'admin'
	})
	superUser.save().then((result) => {
		log('super regis succeed?')
		log(result)
		res.redirect('/login')
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})



app.listen(port, () => {
	log(`Listening on port ${port}...`)
});


/** Dataset routes**/
app.get('/datasets', (req, res) => {

});

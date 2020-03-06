/* Users model */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// We'll make this model in a different way
const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, // trim whitespace
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: 'Not valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	phone:{
		type:String,
		required: false,
	},
	nickname:{
		type:String,
		required: false,
	},
	truename:{
		type:String,
		required: false,
	},
	birthday:{
		type:String,
		required: false,
	},
	address:{
		type:String,
		required: false,
	},
	zip:{
		type:String,
		required: false,
	},
	resetToken:{
		type: String, 
		required: false
	},
	resetDate:{
		type: Date, 
		required: false
	},
	power:{//'admin' or 'user'
		type:String,
		required: true,
		minlength: 1
	},
	datasets:[mongoose.Schema.Types.ObjectId],
	
	profile_description:{
		type:String,
		required: false,
	},
	profile_pic_src:{
		type:String,
		required: false,
	},
	
})

UserSchema.statics.returnMinLength = function(){
	return UserSchema.password.minlength
}
// Our own student finding function
UserSchema.statics.findByEmailPassword = function(email, password) {
	const User = this
	console.log('whats this')
	console.log('findbyemailpassword')
	console.log(email)
	return User.findOne({"email": email}).then((user) => {
		if (!user) {
			console.log('I didnt find it')
			console.log(user)
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next();
	}

})


const User = mongoose.model('User', UserSchema)

module.exports = { User }

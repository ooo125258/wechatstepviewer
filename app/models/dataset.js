const mongoose = require('mongoose')

const DatasetSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, // trim whitespace
    },
    owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
    },

	description: {
		type: String,
		required: false
	},
	price:{
		type: String,
		required: false
	},
    main_image:{//Owner image? The CIFAR in databaseView
        type: String, //The image address?
        required: false
    },
    comp_image_1:{//fmri_preview, something like that
		type: String, //The image address?
        required: false
    },
	comp_image_2:{//fmri_preview, something like that
		type: String, //The image address?
        required: false
    },
	comp_image_3:{//fmri_preview, something like that
		type: String, //The image address?
        required: false
    },
	size:{
        type: String,
        required: false
    },
	credibility:{
        type: String,
        required: false
    },
	quality:{
        type: String,
        required: false
    },
    viewers: {//list of ObjectId
        ids:[mongoose.Schema.Types.ObjectId],
    }
})

const Dataset = mongoose.model('Dataset', DatasetSchema)
module.exports = { Dataset }

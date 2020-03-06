/*jshint esversion: 6 */ 
/* jshint browser: true */ 

/* Users model */
const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    date: Date,
    steps:Number
    });
module.exports = {dataSchema}
'use strict'


var mongoose = require('mongoose')
var schema = mongoose.Schema

var UserSchema = schema({

    role:{type:String, default:'staff'},
    nombres:{type: String, required:true},
    apellidos:{type: String, required:true},
    correo:{type: String, required:true},
    password:{type: String, required:true},
    status: { type: String, default: 'activo', required: true },
    avatar: { type: String }

}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);
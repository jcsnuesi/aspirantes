'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema

var GrupoSchema = Schema({

    codigo:{type:String, required:true},
    aspirantesId: [{ type: 'ObjectId', ref: 'Aspirantes' }],
    status: { type: String, default:'activo'} 
    
})

module.exports = mongoose.model('Grupos', GrupoSchema)
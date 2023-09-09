'use strict'

var mongoose =  require('mongoose')
var schema = mongoose.Schema

var AspitantesSchema = schema({

    avatar: { type: String },
    nombres:{type:String, required: true},
    apellidos:{type:String, required: true},
    sexo:{type:String, required: true},
    cedula:{type:String, required: true},
    fecha_nacimiento: { type: String, required: true},
    edad:{type:Number, required: true},
    estatura: { type: String, required: true},
    celular:{type:String},
    peso:{type:String},
    colorpiel:{type:String},
    colorpelo:{type:String},
    constitucionFisica:{type:String},
    colorojos:{type:String},
    correo: { type: String},
    recomendacion: { type: String, required: true },
    observacion:{type:String},
    psic: { type: String, required: true }, // psicologia -apto o no apto
    cg: { type: Number, required: true }, // cultura general
    psict: { type: Number, required: true},//psicotecnico
    prom: { type: Number, required: true},// promedio
    medicos:{type:String, required: true},//evaluacion medica -apto o no apto
    fisico: { type: Number, required: true},    
    codigo: { type: String, required: true },
    estatus: { type: String, default: 'seleccionado' }
}, { timestamps: true })


module.exports = mongoose.model('Aspirantes',AspitantesSchema);
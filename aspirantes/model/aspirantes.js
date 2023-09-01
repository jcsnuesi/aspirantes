'use strict'

var mongoose =  require('mongoose')
var schema = mongoose.Schema

var AspitantesSchema = schema({

    avatar: { type: String, required: true },
    nombres:{type:String, required: true},
    apellidos:{type:String, required: true},
    sexo:{type:String, required: true},
    cedula:{type:String, required: true},
    fecha_nacimiento:{type:Date, required: true},
    edad:{type:Number, required: true},
    estatura: { type: String, required: true},
    celular:{type:String, required: true},
    peso:{type:String, required: true},
    colorpiel:{type:String, required: true},
    colorpelo:{type:String, required: true},
    constitucionFisica:{type:String, required: true},
    colorojos:{type:String, required: true},
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
    estatus: { type: String, default: 'en proceso' }
}, { timestamps: true })


module.exports = mongoose.model('Aspirantes',AspitantesSchema);
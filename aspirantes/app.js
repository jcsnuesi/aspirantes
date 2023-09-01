'use strict'

var express = require('express')
var cors = require('cors')
var bodyparser = require('body-parser')
var morgan =  require('morgan')


var app = express()

//Cargar rutas de archivos
var user_route = require('./routes/user')
var registros_route = require('./routes/registros')
var grupos_route = require('./routes/grupos')

//Middlewares
app.use(morgan('dev'))
app.use(cors())


app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use('/api', user_route)
app.use('/api', registros_route)
app.use('/api', grupos_route)

module.exports = app;
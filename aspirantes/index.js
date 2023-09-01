'use strict'

require('dotenv').config({ path: ".env" })
const mongoose = require('mongoose')
var app = require('./app')
var port = process.env.PORT
var connection = process.env.MONGODB_URI


mongoose.set('strictQuery', true);
const connectBD = async () => {

    try {

        await mongoose.connect(connection,{
            useNewUrlParser:true,
            useUnifiedTopology: true
        })
        console.log('MongoDB connected!')
        
    } catch (error) {
        
        console.log(error)
    }
}

app.listen(port, () => {
    connectBD()
    console.log("Corriendo en el puerto:",port)
    console.log('Servidor corriendo.')
})
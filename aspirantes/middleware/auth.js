'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = "an-ard-2023-agosto"

module.exports.autenticacion = function(req, res, next) {

    if (!req.headers.authorization) {

        return res.status(403).send({

            status:"denied",
            message: "You don't have the corresponding authentication."
        })
        
    }
  //Limpiar el token y quitar comillar

    let token = req.headers.authorization.replace(/['"]+/g,  '')

    try {
        var payload = jwt.decode(token, secret)

          //Comprobar si el token han expirado

          if (payload.exp <= moment().unix()) {

              return res.status(404).send({
                  message: "El token ha expirado."
              })

            
          }

    } catch (error) {

        return res.status(404).send({
            message: "El token no es valido."
        })
        
    }

     //Adjuntar usuario identificado a la request

     req.user = payload;

     //Pasar a la accion

     next();

    
}
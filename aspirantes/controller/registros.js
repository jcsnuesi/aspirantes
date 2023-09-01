'use strict'

const path = require('path')
const fs = require('fs')
var Aspirantes = require('../model/aspirantes')
var Grupos = require('../model/grupos')
var validator = require('validator')
let _errors = require('../error/exceptions')
let jwtoken = require('../service/jwt')
const { group } = require('console')


var RegistrosController = {


    creaRegistro: function (req, res) {

        var params = req.body
        var condicion = []
       
        
        var avatarPath = req.files.avatar.path
        var namesplit = avatarPath.split(/[\\.]+/g)
        var file_name = namesplit[2] + '.' + namesplit[3].toLowerCase()

        try {

            for (const key in params) {

                if (key.includes("correo")) {
                    condicion.push(validator.isEmail(params[key]))
                
                }else{

                    condicion.push(!validator.isEmpty(params[key]))
                }
            }

            if (condicion.includes(false)) {

                throw new Error("Error grave")
            
            }
        
           
        } catch (error) {
           return res.status(400).send({

                status: 'error',
                message: 'Debe completar los campos correctamente.'
            })



        }

        if (!condicion.includes(false)) {

            Aspirantes.findOne({ cedula: params.cedula }, (err, user) => {

                if (err || user != null) {

                    var info = _errors.duplicated(err, user)

                    return res.status(info.code).send({

                        status: info.status,
                        message: info.message


                    })
                }

                var aspirantes = new Aspirantes();

                for (const key in params) {

                        aspirantes[key] = params[key]
                    
                }

                aspirantes.avatar = file_name;
                aspirantes.prom = (aspirantes.psict + aspirantes.cg) / 2

             
                aspirantes.save((err, userCreated) => {
                    

                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: 'Server error, please try again'
                        })

                    }

                    const idAspirante = userCreated._id
                    Grupos.findOne({ codigo: (params.codigo.toUpperCase()).substring(0, 2) }, (err, success) => {

                        success.aspirantesId.push(idAspirante)


                        Grupos.findOneAndUpdate({ codigo: (params.codigo.toUpperCase()).substring(0, 2) }, success, { new: true }, (error, response) => {

                        })


                    })

                    return res.status(200).send({
                        status: 'success',
                        aspirante: userCreated
                    })


                })

            })



        } else {

            return res.status(400).send({

                status: 'error',
                message: 'Confirme que todos los campos esten debidamente completados.'
            })

        }


    },
    aspirantes: function (req, res) {

        Aspirantes.find((err, aspirantesFound) => {


            if (err || aspirantesFound == null || (aspirantesFound).length <= 0) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Server error.'
                })

            }
            return res.status(200).send({
                status: 'success',
                message: aspirantesFound
            })


        })
    },
    aspirante: function (req, res) {

        var params = req.params.ced


        try {

            var cedula_val = !validator.isEmpty(params)

        } catch (error) {

            return res.status(403).send({
                status: 'error',
                message: 'Complete los campos correctamente.'
            })

        }


        if (cedula_val) {

            Aspirantes.findOne({ cedula: params }, (err, userFound) => {

                if (err || userFound == null || (userFound).length <= 0) {

                    var info = _errors.user_status(err, userFound)

                    return res.status(info.code).send({

                        status: info.status,
                        message: info.message
                    })

                }

                return res.status(200).send({
                    status: 'success',
                    usuario: userFound
                })


            })

        }

    },
    actualizarAspirante: function (req, res) {

        var params = req.body;
        var condicion = []

        try {

            for (const key in params) {

                if (key.includes("correo")) {
                    condicion.push(validator.isEmail(params[key]))

                } else {

                    condicion.push(!validator.isEmpty(params[key]))
                }
            }

            if (condicion.includes(false)) {

                throw new Error("Error grave")

            }


        } catch (error) {
            return res.status(400).send({

                status: 'error',
                message: 'Debe completar los campos correctamente.'
            })

        }

        if (!condicion.includes(false)) {

            Aspirantes.findOne({ _id: params.id }, (err, userFound) => {

                if (err || userFound == null || (userFound).length <= 0) {

                    var info = _errors.user_status(err, userFound)

                    return res.status(info.code).send({

                        status: info.status,
                        message: info.message
                    })

                }
               

                Aspirantes.findOneAndUpdate({ _id: params.id }, params, { new: true }, (err, updated) => {

                    if (err) {

                        var info = _errors.user_status(err, 'n/a')

                        return res.status(info.code).send({

                            status: info.status,
                            message: info.message
                        })

                    }

                    return res.status(200).send({
                        status: 'success',
                        usuario: updated
                    })


                })



            })


        } else {

            var info = _errors.passwordLength(password_val)

            if (password_val == false) {

                return res.status(info.code).send({

                    status: info.status,
                    message: info.message
                })

            }


        }
    },

    eliminarAspirante: function (req, res) {

        var params = req.params.id

        if (req.user.role != 'root') {

            return res.status(403).send({
                status: 'forbidden',
                message: 'No estas autorizado para esta accion.'
            })

        }

        Aspirantes.findOneAndDelete({ _id: params }, (err, deleted) => {

            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Error del servidor, intente nuevamente.'
                })

            }

            return res.status(200).send({
                status: 'success',
                usuario_eliminado: deleted
            })

 
        })
    },
    subirAvatarAspirante: function (req, res) {

        var avatarPath = req.files.avatar.path

        var params = req.body

        var namesplit = avatarPath.split(/[\\.]+/g)

        let extension = ['jpg', 'jpeg', 'gif', 'png']

        if (!extension.includes(namesplit[3].toLowerCase())) {

            fs.unlink(avatarPath, (err) => {

                return res.status(403).send({
                    status: 'Failed',
                    message: `Solo se aceptan los siguentes formatos: ${extension}`
                })
            })

        }

        var file_name = namesplit[2] + '.' + namesplit[3].toLowerCase()

        Aspirantes.findOneAndUpdate({ _id: params.id }, { avatar: file_name }, { new: true }, (err, userUpdated) => {

            if (err || !userUpdated) {

                return res.status(500).send({
                    status: 'error',
                    mesage: 'Error al subir la imagen'

                });

            }

            //Devolver respuesta
            return res.status(200).send({
                status: 'success',
                user: userUpdated

            });

        })

    }, avatar: function (req, res) {

        let filename = req.params.filename
        let pathFile = 'assets/aspirantes/' + filename
      
        fs.stat(pathFile, (err, stat) => {

            if (stat) {
                return res.sendFile(path.resolve(pathFile))
            } else {
                return res.status(404).send({
                    message: "Imagen no existe."
                })
            }

        })


    }
    

}

module.exports = RegistrosController;
'use strict'

const path = require('path')
const fs = require('fs')
var User = require('../model/user')
var validator = require('validator')
let bcrypt = require('bcrypt')
let saltRounds = 10;
let _errors = require('../error/exceptions')
let jwtoken = require('../service/jwt')

var UserController = {


    crearCuenta: function(req, res){

        var params = req.body

        try {

            var nombres_val = !validator.isEmpty(params.nombres)
            var apellidos_val = !validator.isEmpty(params.apellidos)
            var correo_val = validator.isEmail(params.correo)
            var password_val = (params.password).length < 7 ? false : true

            
        } catch (error) {

         
            return res.status(400).send({

                status: 'error',
                message: 'Debe completar los campos correctamente.'
            })

           
            
        }

        if (correo_val && password_val && nombres_val && apellidos_val ) {

            User.findOne({ correo: params.correo }, (err, user) =>{

                if (err || user != null){

                  var info =  _errors.duplicated(err, user)

                    return res.status(info.code).send({

                        status: info.status,
                        message:info.message

                       
                    }) 
                } 

                var usuario = new User();                 
             
                for (const key in params) {

                    if (key != "password") {
                        
                        usuario[key] = params[key]
                    }

                }

              
                bcrypt.hash(params.password, saltRounds, (err, hash) => {

                    usuario.password = hash;

                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: 'Encripts error, please try again'
                        })

                    }

                    usuario.save((err, userCreated) => {

                        if (err) {

                            return res.status(500).send({
                                status: 'error',
                                message: 'Encripts error, please try again'
                            })

                        }
                        userCreated.password = undefined;
                        return res.status(200).send({
                            status: 'success',
                            user: userCreated
                        })


                    })


                })         
       
                    
            })


            
        }else{

            if (password_val == false) {

                return res.status(400).send({

                    status: 'error',
                    message: 'La contraseña debe tener mas de 7 caracteres.'
                })

            }


            return res.status(400).send({

                status: 'error',
                message: 'Confirme que todos los campos esten debidamente completados.'
            })

        }


    },
    login:function(req,res){

        var params = req.body

        try {

            var correo_val = validator.isEmail(params.correo)
            var password_val = (params.password).length < 7 ? false : true
            
        } catch (error) {
           

            return res.status(400).send({

                status: 'error',
                message: 'Debe completar los campos correctamente.'
            })
            
        }


        if (correo_val && password_val) {

            User.findOne({ correo: params.correo }, (err, user) => {
               
                if (err || user == null) {

                    var info = _errors.user_status(err, user)
                  
                    return res.status(info.code).send({

                        status: info.status,
                        message: info.message
                    })

                } 

                if (user.status == "inactivo") {
                    return res.status(403).send({
                        status: 'Forbidden',
                        message:'Usuario inactivo'

                    });
                }
            
              
                bcrypt.compare(params.password, user.password,(err, verified) => {

                    if (verified) {

                        if (params.token) {

                            return res.status(200).send({

                                token: jwtoken.createToken(user)
                            })

                        } else {

                            //Limpiar el objeto para que no se muestre el resultado de la password
                            user.password = undefined;
                            user.account = undefined;

                            //Devolver datos

                            return res.status(200).send({
                                status: 'success',
                                user

                            });

                        }
                        
                    }else{

                        return res.status(403).send({
                            status:'error',
                            message: "Invalid credentials."
                        });


                    }

                    
                } )
                

            })

            
        }else{

            if (password_val == false) {

                return res.status(400).send({

                    status: 'error',
                    message: 'La contraseña debe tener mas de 7 caracteres.'
                })

            }

            return res.status(400).send({

                status: 'error',
                message: 'Confirme que todos los campos esten debidamente completados.'
            })


        }
    },
    usuarios:function(req, res){

        User.find((err, users) => {


            if (users == null || (users).length <= 0) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Server error.'
                })

            }
            return res.status(200).send({
                status: 'success',
                message: users
            })


        })
    },
    usuario:function(req, res){

        var params = req.params.email
       
        
        try {

            var correo_val = validator.isEmail(params)
            
        } catch (error) {

            return res.status(403).send({
                status: 'error',
                message: 'Complete los campos correctamente.'
            })
            
        }


        if (correo_val) {

            User.findOne({correo: params}, (err, userFound) => {

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
    actualizar:function(req,res){

        var params = req.body;

        try {

            var correo_val = validator.isEmail(params.correo)
            var password_val = (params.password).length < 7 ? false : true
            var nombres_val = !validator.isEmpty(params.nombres)
            var apellidos_val = !validator.isEmpty(params.apellidos)

        } catch (error) {

            return res.status(403).send({
                status: 'error',
                message: 'Complete los campos correctamente.'
            })

        }


        if (correo_val && nombres_val && apellidos_val && password_val) {

            User.findOne({_id: params.id}, async (err, userFound) => {

                if (err || userFound == null || (userFound).length <= 0) {

                    var info = _errors.user_status(err, userFound)

                    return res.status(info.code).send({

                        status: info.status,
                        message: info.message
                    })

                } 


                for (const key in params) {
                   
                   if(key === "password"){

                       params.password = await bcrypt.hash(params.password, saltRounds)
                   }
                   
                }
                
                User.findOneAndUpdate({ _id: params.id }, params, {new:true}, (err, updated) => {

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
            
            
        }else{

         var info = _errors.passwordLength(password_val)

            if (password_val == false) {

                return res.status(info.code).send({

                    status: info.status,
                    message: info.message
                })

            }


        }
    },

    eliminar:function(req, res){

        var params = req.body

            if (req.user.role != 'root') {

                return res.status(403).send({
                    status: 'forbidden',
                    message: 'No estas autorizado para esta accion.'
                })
                
            }

        User.findOneAndDelete({_id:params.id}, (err, deleted) =>{

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
    subirAvatar:function(req, res){

        var fileName = 'Avatar no subido...'

        var avatarPath = req.files.file0.path

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

        
        User.findOneAndUpdate({ _id: req.user.sub }, { avatar: file_name }, {new: true},(err, userUpdated) => {

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
        let pathFile = 'assets/upload/' + filename
     
        
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

module.exports = UserController;
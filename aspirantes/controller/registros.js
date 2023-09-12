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

    crearAspirantesPorDoc:async function(req,res) {

        var params = req.body


        // let arrayAspitantes = aspirantesArray
        var duplicados = []
        var nuevos_aspirantes = []
       
        
       

        try {

            for (let index = 0; index < params.length; index++) {
                var aspirante = new Aspirantes()
                var grupo = new Grupos()
       
                for (const key in params[index]) {
        
                
                    if (key == 'codigo') {
        
                        aspirante['sexo'] =  (params[index][key].startsWith('F')) ? 'Femenino' : 'Masculino'
                        aspirante[key] = params[index][key]
                    }
                    
                    aspirante[key] = params[index][key]
                    
                    
                }
        
                const codigoEncontrado = await Grupos.findOne({ codigo: (aspirante.codigo).substring(0,2)})
                const aspiranteEncontrado = await Aspirantes.findOne({ codigo: aspirante.codigo})
                      
            
                // console.log(aspiranteEncontrado)
        
                if (codigoEncontrado == null) {
                    
                    grupo.codigo = (aspirante.codigo).substring(0, 2)
                    grupo.aspirantesId.push(aspirante._id)
                    await grupo.save();
                }else{
                    codigoEncontrado.aspirantesId.push(aspirante._id)
                    await Grupos.findOneAndUpdate({ codigo: (aspirante.codigo).substring(0, 2) }, codigoEncontrado,{new:true})
                 
                }
                
        
                if (aspiranteEncontrado != null) {            
                    
                   duplicados.push(aspirante.codigo)
                 
        
                } else {
                          
                 
                    await aspirante.save();
                   nuevos_aspirantes.push(aspirante)
        
                }
                
            }

            return res.status(200).send({

                status: 'success',
                message: 'Aspirantes creados exitosamente.',
                aspirantes_nuevos:nuevos_aspirantes
            })
            
        } catch (error) {

            return res.status(500).send({

                status: 'error',
                message: 'Error al guardar aspirantes.',
                duplicados: duplicados
            })
            
        }
    
        
       
      
    },
    creaRegistro:async function (req, res) {

        
        var params = req.body      
        var condicion = []      
    
        var avatarPath = (req?.files?.avatar?.path != undefined) ? req.files?.avatar?.path : params?.avatar
        if(req.files?.avatar?.path != undefined || req.files?.avatar?.path != null){

            var namesplit = avatarPath.split(/[\\.]+/g)
            var file_name = namesplit[2] + '.' + namesplit[3].toLowerCase()
        }

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
                        // Crear una condicion para cuando el grupo no exista que lo cree

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

        

        Aspirantes.find({ estado: { $ne: "inactivo" } },(err, aspirantesFound) => {


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

     

                    condicion.push(!validator.isEmpty(params[key]))
                

                 
            }

        

        } catch (error) {
            console.log(error)
            return res.status(400).send({

                status: 'error',
                message: 'Debe completar los campos correctamente.',
                errors:error
            })

        }
    
   
        if (!condicion.includes(false)) {

           
            Aspirantes.findOne({ cedula: params.cedula }, async  (err, userFound) => {
                
                if (err || userFound == null || (userFound).length <= 0) {

                    var info = _errors.user_status(err, userFound)

                    return res.status(info.code).send({
 
                        status: info.status,
                        message: info.message
                    })

                }

                if (params.estatus == 'inactivo') {

                    const grupoAspirante = await Grupos.findOne({ aspirantesId: userFound._id })

                    (grupoAspirante.aspirantesId).shift()
                    await Grupos.findOneAndUpdate({ codigo: (userFound.codigo).substring(0, 2) }, grupoAspirante,{new:true} )
                    
                }

                Aspirantes.findOneAndUpdate({ codigo: params.codigo }, params, { new: true }, (err, updated) => {
                  
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
    actualizarAspiranteFile: async function (req, res) {

        var params = req.body;

       
        try {

           
            var aspirante_actualizado = []
            for (let index = 0; index < params.length; index++) {
                
                
             const AspiranteFound = await Aspirantes.findOne({ codigo: params[index].codigo })

                if (params[index].estatus == 'inactivo') {
    
                    const grupoAspirante = await Grupos.findOne({ aspirantesId: userFound._id })

                    console.log((grupoAspirante.aspirantesId).shift())
                    await Grupos.findOneAndUpdate({ codigo: (userFound.codigo).substring(0, 2) }, grupoAspirante,{new:true} )
                    
                }      
                
               
             
             var aspirante_updated =  await Aspirantes.findOneAndUpdate({ codigo: params[index].codigo }, params[index], { new: true })


             aspirante_actualizado.push(aspirante_updated)

                
            }

        

        } catch (error) {
            return res.status(400).send({

                status: 'error',
                message: 'Hubo un error al actualizar, verifique los campos.'
            })

        }

        
        return res.status(200).send({

            status: 'success',
            message: 'Aspirantes actualizados exitosamente.',
            aspirante_updated:aspirante_actualizado
        })


       
    },

    eliminarAspirante: function (req, res) {

        var params = req.params.id

       
        
        Aspirantes.findOneAndDelete({ _id: params }, (err, deleted) => {

            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Error del servidor, intente nuevamente.'
                })

            }

            Grupos.findOneAndDelete({
                aspirantesId: params
            },(err,grupoDel)=>{
                console.log(grupoDel)
            })
           

            return res.status(200).send({
                status: 'success',
                usuario_eliminado: deleted
            })

 
        })
    }
    // },
    // subirAvatarAspirante: function (req, res) {

    //     var avatarPath = req.files.avatar.path

    //     var params = req.body

    //     var namesplit = avatarPath.split(/[\\.]+/g)

    //     let extension = ['jpg', 'jpeg', 'gif', 'png']

    //     if (!extension.includes(namesplit[3].toLowerCase())) {

    //         fs.unlink(avatarPath, (err) => {

    //             return res.status(403).send({
    //                 status: 'Failed',
    //                 message: `Solo se aceptan los siguentes formatos: ${extension}`
    //             })
    //         })

    //     }

    //     var file_name = namesplit[2] + '.' + namesplit[3].toLowerCase()

    //     Aspirantes.findOneAndUpdate({ _id: params.id }, { avatar: file_name }, { new: true }, (err, userUpdated) => {

    //         if (err || !userUpdated) {

    //             return res.status(500).send({
    //                 status: 'error',
    //                 mesage: 'Error al subir la imagen'

    //             });

    //         }

    //         //Devolver respuesta
    //         return res.status(200).send({
    //             status: 'success',
    //             user: userUpdated

    //         });

    //     })

    // }
    , 
    avatar: function (req, res) {

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
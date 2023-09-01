var Grupos = require('../model/grupos')
var validator = require('validator')
let _errors = require('../error/exceptions')
const path = require('path')
const fs = require('fs')

var CodigoController = {
    crearGrupo: function (req, res) {

        var params = req.body

        try {


            var val_codigo = !validator.isEmpty(params.codigo)



        } catch {

            return res.status(403).send({
                status: "error",
                message: "Complete los campos correctamente."
            })

        }

        if (val_codigo) {

            Grupos.find({ codigo: params.codigo.toUpperCase() }, (err, grupoFound) => {
            
                
                if (err || (grupoFound).length > 0) {

                    var info = _errors.duplicated(err, grupoFound)

                    return res.status(info.code).send({

                        status: info.status,
                        message: info.message


                    })
                }

                var grupoNew = new Grupos()


                for (const key in params) {

                    grupoNew[key] = params[key].toUpperCase()
                }

                grupoNew.save((err, group) => {

                    if (err) {

                        return res.status(500).send({

                            status: 'error',
                            message: 'Error al guardar el grupo'

                        })

                    }


                    //Devolver respuesta
                    return res.status(200).send({
                        status: 'success',
                        nuevo_grupo: group

                    });
                })



            })

        }

    },
    getGroups:function(req, res){

        Grupos.find((err, group)=>{

            if (err) {
                return res.status(404).send({
                    status: "error",
                    message: "No existen grupos."
                })
            }

            return res.status(200).send({
                status: "success",
                grupos: group
            })



        })
        
    },
    cantidadApirantesPorGrupo:async function(req,res){

        var params = req.params.codigo

       const AspitantesEnGrupo = await Grupos.find({ codigo: params })
        const total = (AspitantesEnGrupo[0].aspirantesId).length + 1

       
        return res.status(200).send({
            status: "success",
            codigo: AspitantesEnGrupo[0].codigo,
            total: total
        })
 
    },
    getGroupById: function (req, res) {


        var params = req.params.id

        try {


            var val_codigo = !validator.isEmpty(params)



        } catch {

            return res.status(403).send({
                status: "error",
                message: "Complete los campos correctamente."
            })

        }


        if (val_codigo) {

            Grupos.findOne({ codigo: params })
                .populate('aspirantesId', 'nombres avatar nombres apellidos sexo cedula fecha_nacimiento edad estatura celular correo recomendacion observacion psic cg psict prom medicos fisico codigo estatus').exec((err, group) => {

                if (err) {
                    return res.status(404).send({
                        status: "error",
                        message: "No existen grupos."
                    })
                }



                return res.status(200).send({
                    status: "success",
                    grupos: group
                })



            })
            
        }else{

            return res.status(400).send({
                status: "error",
                message: "Debe completar todos los campos."
            })
        }
      

    },
    updateGrupos:function(req, res){

        var params = req.body

       try {


            var val_codigo = !validator.isEmpty(params.codigo)



        } catch {

            return res.status(403).send({
                status: "error",
                message: "Complete los campos correctamente."
            })

        }

        if (val_codigo) {


            Grupos.find({ _id: params.id }, (err, groupFound) => {

                if (err || (groupFound).length <= 0) {
            
                    
                    var info = _errors.user_status(err, groupFound)

                   
                    return res.status(info.code).send({

                        status: info.status,
                        message: info.message


                    })
                }

                Grupos.findOneAndUpdate({ _id: params.id }, params,  {new:true},(err, grupoUpdated) => {

                    if (err) {

                        var info = _errors.updating(err)

                        return res.status(info.code).send({

                            status: info.status,
                            message: info.message


                        })
                    }

                    return res.status(200).send({

                        status: 'success',
                        grupoActualizado: grupoUpdated


                    })


                })



            })
        }


    },

    eliminarGrupos: function (req, res) {

        var params = req.params.id

        if (req.user.role != 'root') {

            return res.status(403).send({
                status: 'forbidden',
                message: 'No estas autorizado para esta accion.'
            })

        }

        Grupos.findOneAndDelete({ _id: params }, (err, deleted) => {

            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Error del servidor, intente nuevamente.'
                })

            }

            return res.status(200).send({
                status: 'success',
                grupo_eliminado: deleted
            })


        })
    }, avatarCodigo: function (req, res) {

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

module.exports = CodigoController;
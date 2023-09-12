'use strict'

var express = require('express')
var router = express.Router()
var RegistrosController = require('../controller/registros')
 
var md_auth = require('../middleware/auth')
var multipart = require('connect-multiparty')
var uploadDir = multipart({uploadDir:'assets/aspirantes'})

// RUTAS POST
 
router.post('/crear-aspirante', [md_auth.autenticacion, uploadDir], RegistrosController.creaRegistro)
router.post('/crear-aspiranteFile', [md_auth.autenticacion, uploadDir], RegistrosController.crearAspirantesPorDoc)



// RUTAS GET

router.get('/aspirantes', md_auth.autenticacion, RegistrosController.aspirantes)
router.get('/aspirante/:ced', md_auth.autenticacion, RegistrosController.aspirante)
router.get('/foto/:filename', RegistrosController.avatar);

// RUTAS PUT

router.put('/actualizar-aspirante',md_auth.autenticacion, RegistrosController.actualizarAspirante)
router.put('/actualizar-aspiranteFile', md_auth.autenticacion, RegistrosController.actualizarAspiranteFile)

// RUTAS DELETE 

router.delete('/eliminar-aspirante/:id', md_auth.autenticacion, RegistrosController.eliminarAspirante)

module.exports = router;
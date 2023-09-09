'use strict'

var express = require('express')
var router = express.Router()
var CodigoController = require('../controller/grupos')
 
var md_auth = require('../middleware/auth')

// RUTAS GET     
 
router.get('/grupos', md_auth.autenticacion, CodigoController.getGroups)
router.get('/grupo-total-aspirantes/:codigo', md_auth.autenticacion, CodigoController.cantidadApirantesPorGrupo)
router.get('/gruposId/:id', md_auth.autenticacion, CodigoController.getGroupById)
router.get('/avatarCodigo/:filename', CodigoController.avatarCodigo);
// RUTAS POST

router.post('/crear-grupos', md_auth.autenticacion, CodigoController.crearGrupo)

// RUTAS PUT

router.put('/actualizar-grupos', md_auth.autenticacion, CodigoController.updateGrupos)

// RUTAS DELETE

router.delete('/del-grupos/:id', md_auth.autenticacion, CodigoController.eliminarGrupos)


module.exports = router;

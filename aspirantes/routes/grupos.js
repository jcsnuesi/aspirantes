'use strict'

var express = require('express')
var router = express.Router()
var RegistrosController = require('../controller/grupos')
 
var md_auth = require('../middleware/auth')

// RUTAS GET    

router.get('/grupos', md_auth.autenticacion, RegistrosController.getGroups)
router.get('/grupo-total-aspirantes/:codigo', md_auth.autenticacion, RegistrosController.cantidadApirantesPorGrupo)
router.get('/gruposId/:id', md_auth.autenticacion, RegistrosController.getGroupById)
// RUTAS POST

router.post('/crear-grupos', md_auth.autenticacion, RegistrosController.crearGrupo)

// RUTAS PUT

router.put('/actualizar-grupos', md_auth.autenticacion, RegistrosController.updateGrupos)

// RUTAS DELETE

router.delete('/del-grupos/:id', md_auth.autenticacion, RegistrosController.eliminarGrupos)


module.exports = router;

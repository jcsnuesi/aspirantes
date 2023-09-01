'use strict'

var express = require('express')
var router = express.Router()
var md_auth = require('../middleware/auth')
var UserController = require('../controller/user')

let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir: 'assets/upload' })

// ROUTE POST

router.post('/create-user', UserController.crearCuenta);
router.post('/subir-avatar', [md_auth.autenticacion, md_upload], UserController.subirAvatar)
router.post('/login', UserController.login);

// ROUTE GET


router.get('/users', UserController.usuarios);
router.get('/user/:email', UserController.usuario);
router.get('/avatar/:filename', UserController.avatar);

// ROUTE PUT

router.put('/actualizar-user', md_auth.autenticacion, UserController.actualizar)

// ROUTE DELETE

router.delete('/eliminar-user', md_auth.autenticacion, UserController.eliminar)


module.exports = router;
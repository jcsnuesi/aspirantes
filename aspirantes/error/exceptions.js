'use strict'

exports.duplicated = function (err = null, user = null){

    var responseObj = { error: 
        { code: 501, status: "error", message: "Hubo un error en su solicitud, intente nuevamente." }, user: { code: 409, status: "duplicated", message: "Ya se encuentra registrado." }
        }

    if (err != null) {
        return responseObj.error
    } else if (user != null){

        return responseObj.user

    }


}


exports.user_status = function (err = null, user) {

    var responseObj = {
        error:
            { code: 501, status: "error", message: "Hubo un error en su solicitud, intente nuevamente." },
        user: { code: 404, status: "error", message: "No registrado." } }


    if (err != null) {
        return responseObj.error
    } else if (user == null) {

        return responseObj.user

    }
}

exports.passwordLength = function(condicion){

    var responseObj = {
        password_error:
            { code: 400, status: "error", message: "La contraseña debe tener mas de 7 digitos." },
        malformed: { code: 400, status: "error", message: "Complete todos los campos correctamente." }
    }

    if (!condicion) {

        return responseObj.password_error;
        
    } 

     return responseObj.malformed;

  


}


exports.updating = function (err){

    var responseObj = {
        updating_error:
            { code: 500, status: "error", message: "Hubo un error al momento de actualizar, intente nuevamente o comuniquese con soporte tecnico." }
    }

    return responseObj.updating_error;

}
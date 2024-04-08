const helpers = {};

//  /login , login
helpers.obt_ruta = (ubicacion, texto) => {
    // /login / principal /registro
    if (ubicacion != undefined) {
        if (ubicacion.includes(texto)) {
            return "active";
        }
    }

}


helpers.val_rol = (rol) => {
    if (rol === "Administrador") {
        return true
    }
    return false
}

module.exports = helpers;
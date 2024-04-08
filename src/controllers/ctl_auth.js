const User = require("../models/user");
const ctrl = {};


ctrl.asis = async (req, res) => {
    var users = [];

    const user = await User.findOne({"_id":req.session._id}).select("-password");

    

    if(req.session.rol == "Administrador"){
        users = await User.find({"_id":{$nin: req.session._id}}).select("-password");
    }else if(req.session.rol == "Cliente"){
        users = await User.find({"_id":req.session._id}).select("-password");
    }

   

    res.render('auth/table.hbs', { users,session:req.session });

};



ctrl.login = (req, res) => {
    res.render("auth/login.hbs");
};


ctrl.ingresar = async (req, res) => {

    const { email, password } = req.body
    const errores = [];

    const existe = await User.findOne({ "email": email });

    if (!existe) {
        errores.push({ text: "Usuario o clave Incorrecto" });
    } else {
        if (!(await existe.matchPassword(password))) {
            errores.push({ text: "Clave Incorrecta" });
        }
    }

    if (errores.length > 0) {
        res.render("auth/login.hbs", { error_msg: errores })
    } else {
        req.session._id = existe._id;
        req.session.rol = existe.rol;
        res.redirect("/principal")
    }

}



ctrl.registro = (req, res) => {
    res.render("auth/registro.hbs");
}

ctrl.guardar = async (req, res) => {

    const { name, email, password, confirm_password } = req.body;
    const errores = [];

    if (name == "" || email == "" || password == "" || confirm_password == "") {
        errores.push({ text: "Campos Incompletos" });
    }
    if (password != confirm_password) {
        errores.push({ text: "Las claves no coinciden" });
    }

    const existe = await User.findOne({ "email": email });
    if (existe) {
        errores.push({ text: "El usuario ya existe" });
    }

    if (errores.length > 0) {
        res.render("auth/registro.hbs", { error_msg: errores, datos: req.body });
    } else {
        const usuario = new User({
            name,
            email,
            password,
            rol: "Cliente"
        });
        usuario.password = await usuario.encryptPassword(password);
        await usuario.save();
        res.render("auth/registro.hbs", { success_msg: "Cliente Creado Correctamente" });
    }

}


ctrl.salir = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

module.exports = ctrl;
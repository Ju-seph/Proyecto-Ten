const Nota = require("../models/nota");
const ctrl = {};

ctrl.add = (req,res) =>{
    res.render("notas/add.hbs", {session: req.session});
};

ctrl.eliminar = (req,res)=> {

    
}

ctrl.edit = async (req,res) => {
    const codigo = req.params.codigo;

    const nota = await Nota.findOne({"_id": codigo});

    if(nota.user == req.session._id){
        res.render("notas/editar.hbs", {session: req.session, nota});
    }else{
        res.redirect("/principal");
    }

}

ctrl.modificar = async (req,res) =>{
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


ctrl.guardar = async (req,res) =>{
    
    const {title, description} = req.body;
    const errores = [];

    if(title == "" || description == ""){
        errores.push({text:"Campos Incompletos"});
    }

    if(errores.length > 0){
        res.render("notas/add.hbs", {error_msg : errores, datos: req.body });
    }else{

        user = req.session._id

        const nota = new Nota({
            title,
            description,
            user,
        })

        await nota.save();
        res.render("notas/add.hbs", {session: req.session, success_msg : "Nota Creado Correctamente"});

    }

};

module.exports = ctrl;
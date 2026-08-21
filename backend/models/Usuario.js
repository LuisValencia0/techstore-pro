//1 . importar Mongoose

const mongoose = require("mongoose");

//2 . Schema del usuario

const usuarioSchema = new mongoose.Schema({
    nombre:   { type: String, require: true },
    email:    { type: String, require: true, unique: true },
    password: { type: String, require: true }

});

//3 . Exportar el Model

const Usuario = mongoose.model( "Usuario", usuarioSchema );
module.exports = Usuario;
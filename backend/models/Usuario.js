//1 . importar Mongoose

const mongoose = require('mongoose');

//2 . Schema del usuario

const usuarioSchema = new mongoose.Schema({
    nombre:         { type: String, require: true },
    email:          { type: String, require: true, unique: true },
    departamento:   { type: String, require: true },
    municipio:      { type: String, require: true },
    password:       { type: String, require: true },
    rol:            { type: String,
                enum: ['admin', 'cliente'],
                default: 'cliente' }
});

//3 . Exportar el Model

const Usuario = mongoose.model( 'Usuario', usuarioSchema );
module.exports = Usuario;
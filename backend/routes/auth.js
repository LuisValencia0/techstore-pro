// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Usuario } = require("../models/index");
const router = express.Router();

const generarId = () => crypto.randomBytes(12).toString('hex'); // 24 chars

// POST /api/auth/registro
router.post("/registro", async (req, res) => {
    try {
        const { nombre, email, departamento, municipio, password, rol } = req.body;

        const existe = await Usuario.findOne({ where: { email } });
        if (existe) return res.status(400).json({ error: "El email ya esta registrado" });

        const hash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            id: generarId(),
            nombre,
            email,
            departamento,
            municipio,
            password: hash,
            rol: rol || 'cliente'
        });

        res.status(201).json({ mensaje: "Usuario creado correctamente", id: usuario.id });
    } catch (err) {
        console.error('❌ /registro:', err);
        res.status(400).json({ error: err.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(401).json({ error: "Email o contraseña incorrectos" });

        const valida = await bcrypt.compare(password, usuario.password);
        if (!valida) return res.status(401).json({ error: "Email o contraseña incorrectos" });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token, nombre: usuario.nombre, rol: usuario.rol });
    } catch (err) {
        console.error('❌ /login:', err);
        res.status(500).json({ error: err.message });
    }
});

const verificarToken = require('../middleware/auth');

router.get('/perfil', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id, {
            attributes: { exclude: ['password'] }
        });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Formateador para React
        const json = usuario.toJSON();
        res.json({ ...json, _id: json.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
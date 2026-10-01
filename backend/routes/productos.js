// routes/productos.js
const express = require('express');
const crypto = require('crypto');
const { Producto } = require('../models/index');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const router = express.Router();

const generarId = () => crypto.randomBytes(12).toString('hex');

// Formateador: añade _id para compatibilidad con React
const toJSON = (p) => {
    const json = p.toJSON();
    return { ...json, _id: json.id };
};

// GET / — público
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos.map(toJSON));
    } catch (error) {
        console.error('❌ GET /api/productos:', error);
        res.status(500).json({
            error: 'Error al obtener productos',
            mensaje: error.message,
            sqlMessage: error.original?.sqlMessage || null,
            code: error.original?.code || null
        });
    }
});

// GET /:id
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(toJSON(producto));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST / - solo admin
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const nuevo = await Producto.create({
            id: generarId(),
            icono: req.body.icono,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            imagen: req.body.imagen
        });
        res.status(201).json(toJSON(nuevo));
    } catch (err) {
        console.error('❌ POST /api/productos:', err);
        res.status(400).json({ error: err.message });
    }
});

// PUT /:id - solo admin
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ error: 'No encontrado' });

        await producto.update(req.body);
        res.json(toJSON(producto));
    } catch (err) {
        console.error('❌ PUT /api/productos/:id:', err);
        res.status(400).json({ error: err.message });
    }
});

// DELETE /:id - solo admin
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ error: 'No encontrado' });

        const eliminado = toJSON(producto);
        await producto.destroy();
        res.json({ mensaje: 'Eliminado', eliminado });
    } catch (err) {
        console.error('❌ DELETE /api/productos/:id:', err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
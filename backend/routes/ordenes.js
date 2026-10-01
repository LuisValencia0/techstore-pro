// routes/ordenes.js
const express = require('express');
const crypto = require('crypto');
const { Orden, Usuario, Producto, OrdenProducto, sequelize } = require('../models/index');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const router = express.Router();

const generarId = () => crypto.randomBytes(12).toString('hex');

// Formateador para mantener compatibilidad total con React (estructura tipo Mongo)
const formatearOrden = (o) => {
    const json = o.toJSON();
    return {
        _id: json.id,
        usuario: json.usuario,
        usuario_id: json.usuario_id,
        total: json.total,
        estado: json.estado,
        wompiTransactionId: json.wompiTransactionId,
        wompiReference: json.wompiReference,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
        productos: (json.productos || []).map(p => ({
            producto: {
                _id: p.id,
                nombre: p.nombre,
                precio: p.precio,
                icono: p.icono,
                imagen: p.imagen
            },
            cantidad: p.orden_producto?.cantidad || 1
        }))
    };
};

const formatearOrdenes = (ordenes) => {
    if (Array.isArray(ordenes)) return ordenes.map(formatearOrden);
    return formatearOrden(ordenes);
};

// POST /api/ordenes - crear orden
router.post('/', verificarToken, async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { productos, total } = req.body;
        if (!productos?.length) {
            await t.rollback();
            return res.status(400).json({ error: 'La orden debe tener al menos un producto' });
        }

        const ordenId = generarId();

        await Orden.create({
            id: ordenId,
            usuario_id: req.usuario.id,
            total,
            estado: 'pendiente'
        }, { transaction: t });

        for (const item of productos) {
            const pId = item.producto?._id || item.producto;
            await OrdenProducto.create({
                orden_id: ordenId,
                producto_id: pId,
                cantidad: item.cantidad || 1
            }, { transaction: t });
        }

        await t.commit();

        const resultado = await Orden.findByPk(ordenId, {
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
                { model: Producto, as: 'productos', attributes: ['id', 'nombre', 'precio', 'icono', 'imagen'] }
            ]
        });

        res.status(201).json(formatearOrden(resultado));
    } catch (err) {
        await t.rollback();
        console.error('❌ POST /api/ordenes:', err);
        res.status(400).json({ error: err.message });
    }
});

// PATCH /api/ordenes/:id/estado
const ESTADOS_VALIDOS = ['pendiente', 'procesando', 'enviado', 'entregado', 'pago_confirmado', 'PAGO_CONFIRMADO'];

router.patch('/:id/estado', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { estado } = req.body;
        if (!estado) return res.status(400).json({ error: 'Falta el estado' });

        const estadoNormalizado = estado.toLowerCase() === 'pago_confirmado'
            ? 'PAGO_CONFIRMADO'
            : estado.toLowerCase();

        const orden = await Orden.findByPk(req.params.id, {
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
                { model: Producto, as: 'productos', attributes: ['id', 'nombre', 'precio', 'icono', 'imagen'] }
            ]
        });

        if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });

        await orden.update({ estado: estadoNormalizado });
        res.json(formatearOrden(orden));
    } catch (err) {
        console.error('❌ PATCH /api/ordenes/:id/estado:', err);
        res.status(400).json({ error: err.message });
    }
});

// GET /api/ordenes/admin/todas
router.get('/admin/todas', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const ordenes = await Orden.findAll({
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
                { model: Producto, as: 'productos', attributes: ['id', 'nombre', 'precio', 'icono', 'imagen'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(formatearOrdenes(ordenes));
    } catch (err) {
        console.error('❌ GET /api/ordenes/admin/todas:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/ordenes - mis ordenes
router.get('/', verificarToken, async (req, res) => {
    try {
        const ordenes = await Orden.findAll({
            where: { usuario_id: req.usuario.id },
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
                { model: Producto, as: 'productos', attributes: ['id', 'nombre', 'precio', 'icono', 'imagen'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(formatearOrdenes(ordenes));
    } catch (err) {
        console.error('❌ GET /api/ordenes:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
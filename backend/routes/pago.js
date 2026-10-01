// routes/pago.js
const express = require('express');
const crypto = require('crypto');
const { Transaccion, Orden, OrdenProducto, sequelize } = require('../models/index');
const verificarToken = require('../middleware/auth');
const router = express.Router();

const generarId = () => crypto.randomBytes(12).toString('hex');

// POST /api/pagos/firma
router.post('/firma', verificarToken, async (req, res) => {
    const { productos, total } = req.body;

    if (!productos?.length || !total) {
        return res.status(400).json({ error: 'Carrito vacío o total inválido' });
    }

    try {
        const reference = `TS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const amountInCents = Math.round(total * 100);
        const currency = 'COP';

        const raw = `${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`;
        const signature = crypto.createHash('sha256').update(raw).digest('hex');

        // pendingOrderData es LONGTEXT → guardamos el objeto serializado
        await Transaccion.create({
            id: generarId(),
            wompiReference: reference,
            amountInCents,
            currency,
            status: 'PENDING',
            pendingOrderData: JSON.stringify({ usuario: req.usuario.id, productos, total })
        });

        res.json({
            reference,
            amountInCents,
            currency,
            signature,
            publicKey: process.env.WOMPI_PUBLIC_KEY
        });
    } catch (err) {
        console.error('❌ POST /api/pagos/firma:', err);
        res.status(500).json({ error: 'Error al generar la firma', detalle: err.message });
    }
});

// Confirmar orden aprobada por Wompi
async function confirmarAprobado(transaccion, wompiTx) {
    const t = await sequelize.transaction();
    try {
        transaccion.status = wompiTx.status;
        transaccion.wompiTransactionId = wompiTx.id;

        if (wompiTx.status === 'APPROVED' && !transaccion.orden_id) {
            // Parseamos porque la columna es LONGTEXT
            const pod = typeof transaccion.pendingOrderData === 'string'
                ? JSON.parse(transaccion.pendingOrderData)
                : transaccion.pendingOrderData;

            const ordenId = generarId();

            await Orden.create({
                id: ordenId,
                usuario_id: pod.usuario,
                total: pod.total,
                wompiTransactionId: wompiTx.id,
                wompiReference: wompiTx.reference,
                estado: 'PAGO_CONFIRMADO'
            }, { transaction: t });

            for (const item of pod.productos) {
                const pId = item.producto?._id || item.producto;
                await OrdenProducto.create({
                    orden_id: ordenId,
                    producto_id: pId,
                    cantidad: item.cantidad || 1
                }, { transaction: t });
            }

            transaccion.orden_id = ordenId;
        }

        await transaccion.save({ transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error('❌ confirmarAprobado:', error);
        throw error;
    }
}

// GET /api/pagos/estado/:reference
router.get('/estado/:reference', verificarToken, async (req, res) => {
    try {
        const tx = await Transaccion.findOne({ where: { wompiReference: req.params.reference } });
        if (!tx) return res.status(404).json({ error: 'Transacción no encontrada' });

        if (tx.status === 'PENDING') {
            const wompiRes = await fetch(
                `https://sandbox.wompi.co/v1/transactions?reference=${tx.wompiReference}`,
                { headers: { Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}` } }
            );

            if (!wompiRes.ok) {
                console.error('Error consultando Wompi:', wompiRes.status, await wompiRes.text());
            } else {
                const wompiJson = await wompiRes.json();
                const wompiTx = wompiJson.data?.[0];

                if (wompiTx && wompiTx.status !== 'PENDING') {
                    await confirmarAprobado(tx, wompiTx);
                }
            }
        }

        res.json({ status: tx.status, ordenId: tx.orden_id ?? null });
    } catch (err) {
        console.error('❌ GET /api/pagos/estado/:reference:', err);
        res.status(500).json({ error: 'Error interno', detalle: err.message });
    }
});

// POST /api/pagos/webhook
router.post('/webhook', async (req, res) => {
    try {
        const { signature, timestamp, data } = req.body;
        const secret = process.env.WOMPI_EVENTS_SECRET;
        if (!secret) return res.status(200).json({ ok: true });

        const tx = data?.transaction;
        if (!tx) return res.status(400).json({ error: 'Payload inválido' });

        const props = (signature?.properties || []).map((prop) => {
            const path = prop.split('.').slice(1);
            let v = tx;
            for (const k of path) v = v?.[k];
            return v;
        }).join('');

        const computed = crypto.createHash('sha256').update(`${props}${timestamp}${secret}`).digest('hex');
        if (computed !== signature?.checksum) return res.status(400).json({ error: 'Firma inválida' });

        const transaccion = await Transaccion.findOne({ where: { wompiReference: tx.reference } });
        if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });

        await confirmarAprobado(transaccion, tx);
        res.json({ ok: true });
    } catch (err) {
        console.error('❌ POST /api/pagos/webhook:', err);
        res.status(500).json({ error: 'Error en webhook' });
    }
});

module.exports = router;
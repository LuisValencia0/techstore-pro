const express  = require('express');
const Producto = require('../models/Producto');
const verifivarToken = require('../middleware/auth');
const verifivarAdmin = require('../middleware/admin');
const verificarAdmin = require('../middleware/admin');
const router         = express.Router();

// 2.  GET / — público, sin token
router.get('/', async (req, res) => {
    try {
      const productos = await Producto.find(); 
      res.json(productos);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  });

// 3. POST / - solo admin (verificarToken + verificarAdmin)
router.post('/', verifivarToken, verificarAdmin, async (req, res) => {
    try {
      const nuevo = await Producto.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
// 4. Ruta PUT / :id - solo admin
router.put('/:id', verifivarToken, verifivarAdmin, async (req, res) => {
    try {
      const actualizado = await Producto.findByIdAndUpdate(
        req.params.id, req.body, { new: true }
      );
      if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
      res.json(actualizado);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // 5. Ruta DELETE / :id - solo admin
  router.delete('/:id', verifivarToken, verifivarAdmin, async (req, res) => {
    try {
      const eliminado = await Producto.findByIdAndDelete(req.params.id);
      if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
      res.json({ mensaje: 'Eliminado', eliminado });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// 6. Exportar
module.exports = router;
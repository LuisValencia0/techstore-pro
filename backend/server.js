// 1. Importar las dependencias
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

// 2. Crear la aplicación y definir el puerto
const app  = express();
const PORT = process.env.PORT || 4000;

// 3. Activar middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar con MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión:', err));

// 5. Ruta GET /api/productos — ahora lee de MongoDB Atlas
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();  // trae todos los docs de Atlas
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 6. Ruta POST /api/productos — crear un producto nuevo ← NUEVO S13
app.post('/api/productos', async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Ruta PUT /api/productos/:id — actualizar un producto ← NUEVO S13
app.put('/api/productos/:id', async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 8. Ruta DELETE /api/productos/:id — eliminar un producto ← NUEVO S13
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente', eliminado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor TechStore Pro ✅' });
});

// 10. Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
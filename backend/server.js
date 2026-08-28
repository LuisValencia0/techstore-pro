// 1. Importar las dependencias
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const authRoutes = require('./routes/auth');
const verifivarToken = require('./middleware/auth');
const productosRoutes = require('./routes/productos');
const ordenesRoutes = require('./routes/ordenes');

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





// 9. Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor TechStore Pro ✅' });
});

// 10. Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

// 11. Rutas de autentificacion - Nuevo S14
app.use("/api/auth", authRoutes);

// 12. Ruta de productos 
app.use('/api/productos', productosRoutes);

// 13. Rutas de ordenes
app.use('/api/ordenes', ordenesRoutes);

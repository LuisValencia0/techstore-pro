// 1. Importar las dependencias
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importamos la instancia de Sequelize y la sincronización de tablas
const { sequelize } = require('./models/index');

// Importar rutas existentes (se mantienen sus mismas definiciones de endpoints)
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const ordenesRoutes = require('./routes/ordenes');
const pagoRoutes = require('./routes/pago'); 

// 2. Crear la aplicación y definir el puerto
const app = express();
const PORT = process.env.PORT || 4000;

// 3. Activar middlewares
app.use(cors());
app.use(express.json());

// 9. Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor TechStore Pro (MySQL Relacional) ✅' });
});

// 11. Rutas de autenticación
app.use("/api/auth", authRoutes);

// 12. Ruta de productos 
app.use('/api/productos', productosRoutes);

// 13. Rutas de órdenes
app.use('/api/ordenes', ordenesRoutes);

// 14. Ruta de pagos
app.use('/api/pagos', pagoRoutes);

// 10. Conectar a MySQL, crear/sincronizar tablas y arrancar el servidor
// force: false asegura que tus datos no se borren cada vez que el servidor se reinicie
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Conectado a MySQL y tablas sincronizadas correctamente');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error de conexión o sincronización en MySQL:', err);
  });

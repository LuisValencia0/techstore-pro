// 1. importar dependencia

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//2 . crear la aplicacion y definir el puerto

const app = express();
const PORT = process.env.PORT || 3000;

//3 . Activar middleawares

app.use(cors());
app.use(express.json());

//4 . Conectar a MongoDB Atlas ---s12
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch((err) => console.error("❌ Error de conexión:", err));

//5 . ruta de prueba

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor TechStore Pro'});
});

//6 . Arrancar el servidor 

app.listen(PORT, ()  => {
    console.log(`Servidor en https://localhost:${PORT}`);
});


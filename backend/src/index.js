const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const categoriasRoutes = require('./routes/categorias');
const serviciosRoutes = require('./routes/servicios');
const paquetesRoutes = require('./routes/paquetes');
const pedidosRoutes = require('./routes/pedidos');
const carritoRoutes = require('./routes/carrito');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    mensaje: 'Backend funcionando ✅',
    timestamp: new Date().toLocaleString('es-CO')
  });
});

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/paquetes', paquetesRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/carrito', carritoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_HOST}`);
});
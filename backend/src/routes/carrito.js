const express = require('express');
const CarritoController = require('../controllers/carritoController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de carrito requieren autenticación
router.get('/', verificarToken, CarritoController.obtener);
router.post('/', verificarToken, CarritoController.agregar);
router.put('/:id', verificarToken, CarritoController.actualizarCantidad);
router.delete('/:id', verificarToken, CarritoController.eliminar);
router.delete('/', verificarToken, CarritoController.vaciar);

module.exports = router;
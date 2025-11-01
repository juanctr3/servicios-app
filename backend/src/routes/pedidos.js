const express = require('express');
const PedidoController = require('../controllers/pedidoController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Rutas protegidas
router.get('/', verificarToken, PedidoController.obtenerTodos);
router.get('/mis-pedidos', verificarToken, PedidoController.obtenerMisPedidos);
router.get('/:id', verificarToken, PedidoController.obtenerPorId);
router.post('/', verificarToken, PedidoController.crear);
router.put('/:id/estado', verificarToken, PedidoController.actualizarEstado);
router.delete('/:id', verificarToken, PedidoController.eliminar);

module.exports = router;
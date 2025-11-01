const express = require('express');
const ServicioController = require('../controllers/servicioController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', ServicioController.obtenerTodos);
router.get('/categoria/:categoria_id', ServicioController.obtenerPorCategoria);
router.get('/id/:id', ServicioController.obtenerPorId);
router.get('/slug/:slug', ServicioController.obtenerPorSlug);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, ServicioController.crear);
router.put('/:id', verificarToken, ServicioController.actualizar);
router.delete('/:id', verificarToken, ServicioController.eliminar);

module.exports = router;
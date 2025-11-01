const express = require('express');
const ServicioController = require('../controllers/servicioController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// ===== RUTAS PROTEGIDAS (ADMIN) - VAN PRIMERO =====
router.post('/', verificarToken, ServicioController.crear);
router.put('/:id', verificarToken, ServicioController.actualizar);
router.delete('/:id', verificarToken, ServicioController.eliminar);

// ===== RUTAS PÚBLICAS - VAN DESPUÉS =====
router.get('/', ServicioController.obtenerTodos);
router.get('/slug/:slug', ServicioController.obtenerPorSlug);
router.get('/categoria/:categoriaId', ServicioController.obtenerPorCategoria);
router.get('/:id', ServicioController.obtenerPorId);

module.exports = router;
const express = require('express');
const CategoriaController = require('../controllers/categoriaController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', CategoriaController.obtenerTodas);
router.get('/:id', CategoriaController.obtenerPorId);
router.get('/slug/:slug', CategoriaController.obtenerPorSlug);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, CategoriaController.crear);
router.put('/:id', verificarToken, CategoriaController.actualizar);
router.delete('/:id', verificarToken, CategoriaController.eliminar);

module.exports = router;
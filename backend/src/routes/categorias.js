const express = require('express');
const CategoriaController = require('../controllers/categoriaController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// ===== RUTAS PROTEGIDAS (ADMIN) - VAN PRIMERO =====
// Crear categoría
router.post('/', verificarToken, CategoriaController.crear);

// Actualizar categoría por ID
router.put('/:id', verificarToken, CategoriaController.actualizar);

// Eliminar categoría por ID
router.delete('/:id', verificarToken, CategoriaController.eliminar);

// ===== RUTAS PÚBLICAS - VAN DESPUÉS =====
// Obtener todas las categorías
router.get('/', CategoriaController.obtenerTodas);

// Obtener por slug (DEBE IR ANTES DE /:id para evitar conflicto)
router.get('/slug/:slug', CategoriaController.obtenerPorSlug);

// Contar servicios de una categoría
router.get('/:id/servicios/count', CategoriaController.contarServicios);

// Obtener categoría por ID
router.get('/:id', CategoriaController.obtenerPorId);

module.exports = router;
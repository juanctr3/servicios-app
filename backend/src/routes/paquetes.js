const express = require('express');
const PaqueteController = require('../controllers/paqueteController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', PaqueteController.obtenerTodos);
router.get('/servicio/:servicio_id', PaqueteController.obtenerPorServicio);
router.get('/id/:id', PaqueteController.obtenerPorId);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, PaqueteController.crear);
router.put('/:id', verificarToken, PaqueteController.actualizar);
router.delete('/:id', verificarToken, PaqueteController.eliminar);

module.exports = router;
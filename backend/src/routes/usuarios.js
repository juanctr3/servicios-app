const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/registro', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// Rutas protegidas
router.get('/perfil', verificarToken, UsuarioController.obtenerPerfil);

module.exports = router;
const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/registro', UsuarioController.registrar);
router.post('/login', UsuarioController.login);

// Rutas protegidas
router.get('/', verificarToken, UsuarioController.obtenerTodos);
router.get('/perfil', verificarToken, UsuarioController.obtenerPerfil);
router.put('/actualizar-perfil', verificarToken, UsuarioController.actualizarPerfil);
router.put('/cambiar-contrasena', verificarToken, UsuarioController.cambiarContrasena);
router.put('/:id/actualizar', verificarToken, UsuarioController.actualizarUsuario);
router.delete('/:id', verificarToken, UsuarioController.eliminarUsuario);

module.exports = router;
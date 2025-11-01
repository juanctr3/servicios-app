const UsuarioModel = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');

class UsuarioController {
  // Registrar
  static async registrar(req, res) {
    try {
      const { email, password, nombre, celular, pais } = req.body;

      // Validar
      if (!email || !password || !nombre) {
        return res.status(400).json({ error: 'Campos requeridos faltantes' });
      }

      // Verificar si existe
      const usuarioExistente = await UsuarioModel.obtenerPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Registrar
      const usuario = await UsuarioModel.registrar(email, password, nombre, celular, pais);

      return res.status(201).json({ 
        mensaje: 'Usuario registrado correctamente',
        usuario 
      });
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ error: 'Error al registrar' });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
      }

      // Buscar usuario
      const usuario = await UsuarioModel.obtenerPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const passwordValida = await UsuarioModel.verificarPassword(password, usuario.password_hash);
      if (!passwordValida) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({ 
        mensaje: 'Login exitoso',
        token,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  // Obtener perfil
  static async obtenerPerfil(req, res) {
    try {
      const usuario = await UsuarioModel.obtenerPorId(req.usuarioId);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.json({ usuario });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener perfil' });
    }
  }
}

module.exports = UsuarioController;
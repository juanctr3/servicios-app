const UsuarioModel = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const bcrypt = require('bcrypt');

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

  // Actualizar perfil
  static async actualizarPerfil(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const { nombre, celular, pais, direccion } = req.body;

      // Validar
      if (!nombre || !celular) {
        return res.status(400).json({ error: 'Nombre y celular son requeridos' });
      }

      // Actualizar en la BD
      const connection = await pool.getConnection();
      await connection.query(
        'UPDATE usuarios SET nombre = ?, celular = ?, pais = ?, direccion = ? WHERE id = ?',
        [nombre, celular, pais, direccion, usuarioId]
      );
      connection.release();

      // Obtener datos actualizados
      const usuarioActualizado = await UsuarioModel.obtenerPorId(usuarioId);

      return res.json({ 
        mensaje: 'Perfil actualizado correctamente',
        usuario: usuarioActualizado
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  }

  // Cambiar contraseña
  static async cambiarContrasena(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const { passwordActual, passwordNueva } = req.body;

      // Validar
      if (!passwordActual || !passwordNueva) {
        return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
      }

      if (passwordNueva.length < 6) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
      }

      // Obtener usuario
      const usuario = await UsuarioModel.obtenerPorId(usuarioId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Obtener usuario completo con password_hash
      const usuarioConPassword = await UsuarioModel.obtenerPorEmail(usuario.email);
      
      // Verificar contraseña actual
      const passwordValida = await UsuarioModel.verificarPassword(passwordActual, usuarioConPassword.password_hash);
      if (!passwordValida) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }

      // Encriptar nueva contraseña
      const passwordHash = await bcrypt.hash(passwordNueva, 10);

      // Actualizar en la BD
      const connection = await pool.getConnection();
      await connection.query(
        'UPDATE usuarios SET password_hash = ? WHERE id = ?',
        [passwordHash, usuarioId]
      );
      connection.release();

      return res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
  }

  // Obtener todos los usuarios (solo admin)
  static async obtenerTodos(req, res) {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.query(
        'SELECT id, email, nombre, celular, pais, rol, created_at FROM usuarios ORDER BY created_at DESC'
      );
      
      connection.release();
      return res.json({ usuarios: rows });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }
  // Actualizar usuario (admin)
  static async actualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nombre, rol } = req.body;

      // Validar
      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es requerido' });
      }

      if (!['usuario', 'admin'].includes(rol)) {
        return res.status(400).json({ error: 'Rol inválido' });
      }

      // Actualizar en la BD
      const connection = await pool.getConnection();
      await connection.query(
        'UPDATE usuarios SET nombre = ?, rol = ? WHERE id = ?',
        [nombre, rol, id]
      );
      connection.release();

      return res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  // Eliminar usuario (admin)
  static async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;

      // No permitir que se elimine a sí mismo
      if (id === req.usuarioId) {
        return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
      }

      // Eliminar de la BD
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
      connection.release();

      return res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
}

module.exports = UsuarioController;

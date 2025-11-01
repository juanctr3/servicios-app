const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class UsuarioModel {
  // Registrar usuario
  static async registrar(email, password, nombre, celular, pais) {
    const connection = await pool.getConnection();
    
    try {
      const id = uuidv4();
      const passwordHash = await bcrypt.hash(password, 10);
      
      await connection.query(
        'INSERT INTO usuarios (id, email, password_hash, nombre, celular, pais, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, email, passwordHash, nombre, celular, pais, 'usuario']
      );
      
      return { id, email, nombre };
    } finally {
      connection.release();
    }
  }

  // Obtener usuario por email
  static async obtenerPorEmail(email) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );
      
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Obtener usuario por ID
  static async obtenerPorId(id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT id, email, nombre, celular, pais, direccion, rol FROM usuarios WHERE id = ?',
        [id]
      );
      
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Verificar contraseña
  static async verificarPassword(passwordIngresada, passwordHash) {
    return await bcrypt.compare(passwordIngresada, passwordHash);
  }
}

module.exports = UsuarioModel;
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CarritoModel {
  // Obtener carrito de un usuario
  static async obtenerPorUsuario(usuario_id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        `SELECT c.*, p.nombre as nombre_paquete, p.cantidad, p.precio, p.descuento_porcentaje, p.es_popular
         FROM carrito c
         JOIN paquetes p ON c.paquete_id = p.id
         WHERE c.usuario_id = ?
         ORDER BY c.added_at DESC`,
        [usuario_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener item específico del carrito
  static async obtenerItem(id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        `SELECT c.*, p.nombre as nombre_paquete, p.cantidad, p.precio, p.descuento_porcentaje
         FROM carrito c
         JOIN paquetes p ON c.paquete_id = p.id
         WHERE c.id = ?`,
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Agregar al carrito
  static async agregar(usuario_id, paquete_id, cantidad) {
    const connection = await pool.getConnection();
    
    try {
      const id = uuidv4();
      
      await connection.query(
        'INSERT INTO carrito (id, usuario_id, paquete_id, cantidad) VALUES (?, ?, ?, ?)',
        [id, usuario_id, paquete_id, cantidad]
      );
      
      return id;
    } finally {
      connection.release();
    }
  }

  // Actualizar cantidad
  static async actualizarCantidad(id, cantidad) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'UPDATE carrito SET cantidad = ? WHERE id = ?',
        [cantidad, id]
      );
      
      return true;
    } finally {
      connection.release();
    }
  }

  // Eliminar del carrito
  static async eliminar(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'DELETE FROM carrito WHERE id = ?',
        [id]
      );
      
      return true;
    } finally {
      connection.release();
    }
  }

  // Vaciar carrito de un usuario
  static async vaciar(usuario_id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'DELETE FROM carrito WHERE usuario_id = ?',
        [usuario_id]
      );
      
      return true;
    } finally {
      connection.release();
    }
  }

  // Obtener total del carrito
  static async obtenerTotal(usuario_id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        `SELECT 
           SUM(p.precio * (1 - p.descuento_porcentaje / 100) * c.cantidad) as total,
           COUNT(c.id) as items
         FROM carrito c
         JOIN paquetes p ON c.paquete_id = p.id
         WHERE c.usuario_id = ?`,
        [usuario_id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  }
}

module.exports = CarritoModel;
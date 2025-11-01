const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PaqueteModel {
  // Obtener todos los paquetes
  static async obtenerTodos() {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM paquetes ORDER BY cantidad ASC'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener paquetes por servicio
  static async obtenerPorServicio(servicio_id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM paquetes WHERE servicio_id = ? ORDER BY cantidad ASC',
        [servicio_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener paquete por ID
  static async obtenerPorId(id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM paquetes WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Crear paquete
  static async crear(servicio_id, nombre, cantidad, precio, descuento_porcentaje, es_popular) {
    const connection = await pool.getConnection();
    
    try {
      const id = uuidv4();
      
      await connection.query(
        'INSERT INTO paquetes (id, servicio_id, nombre, cantidad, precio, descuento_porcentaje, es_popular) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, servicio_id, nombre, cantidad, precio, descuento_porcentaje, es_popular || false]
      );
      
      return { id, nombre, cantidad, precio };
    } finally {
      connection.release();
    }
  }

  // Actualizar paquete
  static async actualizar(id, nombre, cantidad, precio, descuento_porcentaje, es_popular) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'UPDATE paquetes SET nombre = ?, cantidad = ?, precio = ?, descuento_porcentaje = ?, es_popular = ? WHERE id = ?',
        [nombre, cantidad, precio, descuento_porcentaje, es_popular, id]
      );
      
      return { id, nombre, cantidad, precio };
    } finally {
      connection.release();
    }
  }

  // Eliminar paquete
  static async eliminar(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'DELETE FROM paquetes WHERE id = ?',
        [id]
      );
      
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = PaqueteModel;
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PedidoDetalleModel {
  // Obtener detalles de un pedido
  static async obtenerPorPedido(pedido_id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM pedido_detalles WHERE pedido_id = ?',
        [pedido_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Crear detalle de pedido
  static async crear(pedido_id, paquete_id, nombre_paquete, cantidad, precio) {
    const connection = await pool.getConnection();
    
    try {
      const id = uuidv4();
      
      await connection.query(
        'INSERT INTO pedido_detalles (id, pedido_id, paquete_id, nombre_paquete, cantidad, precio) VALUES (?, ?, ?, ?, ?, ?)',
        [id, pedido_id, paquete_id, nombre_paquete, cantidad, precio]
      );
      
      return id;
    } finally {
      connection.release();
    }
  }
}

module.exports = PedidoDetalleModel;
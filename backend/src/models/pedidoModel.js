const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PedidoModel {
  // Obtener todos los pedidos
  static async obtenerTodos() {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM pedidos ORDER BY created_at DESC'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener pedidos por usuario
  static async obtenerPorUsuario(usuario_id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC',
        [usuario_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener pedido por ID (con detalles)
  static async obtenerPorId(id) {
    const connection = await pool.getConnection();
    
    try {
      const [pedidos] = await connection.query(
        'SELECT * FROM pedidos WHERE id = ?',
        [id]
      );
      
      if (!pedidos[0]) return null;

      const [detalles] = await connection.query(
        'SELECT * FROM pedido_detalles WHERE pedido_id = ?',
        [id]
      );

      return {
        ...pedidos[0],
        detalles
      };
    } finally {
      connection.release();
    }
  }

  // Crear pedido
  static async crear(usuario_id, total, metodo_pago, cliente_nombre, cliente_email, cliente_celular, cliente_pais, cliente_direccion) {
    const connection = await pool.getConnection();
    
    try {
      const id = uuidv4();
      
      await connection.query(
        'INSERT INTO pedidos (id, usuario_id, total, metodo_pago, cliente_nombre, cliente_email, cliente_celular, cliente_pais, cliente_direccion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, usuario_id, total, metodo_pago, cliente_nombre, cliente_email, cliente_celular, cliente_pais, cliente_direccion, 'pendiente']
      );
      
      return id;
    } finally {
      connection.release();
    }
  }

  // Actualizar estado del pedido
  static async actualizarEstado(id, estado) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'UPDATE pedidos SET estado = ? WHERE id = ?',
        [estado, id]
      );
      
      return true;
    } finally {
      connection.release();
    }
  }

  // Eliminar pedido
  static async eliminar(id) {
    const connection = await pool.getConnection();
    
    try {
      // Primero eliminar detalles
      await connection.query('DELETE FROM pedido_detalles WHERE pedido_id = ?', [id]);
      
      // Luego eliminar pedido
      await connection.query('DELETE FROM pedidos WHERE id = ?', [id]);
      
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = PedidoModel;
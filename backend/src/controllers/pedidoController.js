const PedidoModel = require('../models/pedidoModel');
const PedidoDetalleModel = require('../models/pedidoDetalleModel');
const UsuarioModel = require('../models/usuarioModel');

class PedidoController {
  // Obtener todos los pedidos (admin)
  static async obtenerTodos(req, res) {
    try {
      const pedidos = await PedidoModel.obtenerTodos();
      return res.json({ pedidos });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  }

  // Obtener pedidos del usuario autenticado
  static async obtenerMisPedidos(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const pedidos = await PedidoModel.obtenerPorUsuario(usuarioId);
      return res.json({ pedidos });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  }

  // Obtener pedido por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const pedido = await PedidoModel.obtenerPorId(id);
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      
      return res.json({ pedido });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener pedido' });
    }
  }

  // Crear pedido
  static async crear(req, res) {
    try {
      const { total, metodo_pago, cliente_nombre, cliente_email, cliente_celular, cliente_pais, cliente_direccion, items } = req.body;
      const usuarioId = req.usuarioId;

      // Validar
      if (!total || !cliente_nombre || !cliente_email || !items || items.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      // Verificar que el usuario existe
      const usuario = await UsuarioModel.obtenerPorId(usuarioId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Crear pedido
      const pedidoId = await PedidoModel.crear(
        usuarioId,
        total,
        metodo_pago,
        cliente_nombre,
        cliente_email,
        cliente_celular,
        cliente_pais,
        cliente_direccion
      );

      // Crear detalles del pedido
      for (const item of items) {
        await PedidoDetalleModel.crear(
          pedidoId,
          item.paquete_id,
          item.nombre_paquete,
          item.cantidad,
          item.precio
        );
      }

      const pedido = await PedidoModel.obtenerPorId(pedidoId);

      return res.status(201).json({ 
        mensaje: 'Pedido creado correctamente',
        pedido 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al crear pedido' });
    }
  }

  // Actualizar estado del pedido (admin)
  static async actualizarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      // Validar
      const estadosValidos = ['pendiente', 'confirmado', 'procesando', 'completado', 'cancelado'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      // Verificar que existe
      const pedidoExistente = await PedidoModel.obtenerPorId(id);
      if (!pedidoExistente) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      // Actualizar
      await PedidoModel.actualizarEstado(id, estado);

      const pedido = await PedidoModel.obtenerPorId(id);

      return res.json({ 
        mensaje: 'Estado actualizado correctamente',
        pedido 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al actualizar estado' });
    }
  }

  // Eliminar pedido (admin)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que existe
      const pedidoExistente = await PedidoModel.obtenerPorId(id);
      if (!pedidoExistente) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      // Eliminar
      await PedidoModel.eliminar(id);

      return res.json({ mensaje: 'Pedido eliminado correctamente' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al eliminar pedido' });
    }
  }
}

module.exports = PedidoController;
const CarritoModel = require('../models/carritoModel');
const PaqueteModel = require('../models/paqueteModel');

class CarritoController {
  // Obtener carrito del usuario
  static async obtener(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const items = await CarritoModel.obtenerPorUsuario(usuarioId);
      const total = await CarritoModel.obtenerTotal(usuarioId);

      return res.json({ 
        items,
        total: total?.total || 0,
        cantidadItems: total?.items || 0
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener carrito' });
    }
  }

  // Agregar al carrito
  static async agregar(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const { paquete_id, cantidad } = req.body;

      // Validar
      if (!paquete_id || !cantidad || cantidad < 1) {
        return res.status(400).json({ error: 'Paquete y cantidad son requeridos' });
      }

      // Verificar que el paquete existe
      const paquete = await PaqueteModel.obtenerPorId(paquete_id);
      if (!paquete) {
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }

      // Agregar al carrito
      const itemId = await CarritoModel.agregar(usuarioId, paquete_id, cantidad);
      const item = await CarritoModel.obtenerItem(itemId);

      return res.status(201).json({ 
        mensaje: 'Agregado al carrito',
        item 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al agregar al carrito' });
    }
  }

  // Actualizar cantidad
  static async actualizarCantidad(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;

      // Validar
      if (!cantidad || cantidad < 1) {
        return res.status(400).json({ error: 'Cantidad debe ser mayor a 0' });
      }

      // Verificar que existe el item
      const item = await CarritoModel.obtenerItem(id);
      if (!item) {
        return res.status(404).json({ error: 'Item no encontrado en carrito' });
      }

      // Actualizar
      await CarritoModel.actualizarCantidad(id, cantidad);
      const itemActualizado = await CarritoModel.obtenerItem(id);

      return res.json({ 
        mensaje: 'Cantidad actualizada',
        item: itemActualizado 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al actualizar cantidad' });
    }
  }

  // Eliminar del carrito
  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que existe
      const item = await CarritoModel.obtenerItem(id);
      if (!item) {
        return res.status(404).json({ error: 'Item no encontrado en carrito' });
      }

      // Eliminar
      await CarritoModel.eliminar(id);

      return res.json({ mensaje: 'Item eliminado del carrito' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
  }

  // Vaciar carrito
  static async vaciar(req, res) {
    try {
      const usuarioId = req.usuarioId;

      // Vaciar
      await CarritoModel.vaciar(usuarioId);

      return res.json({ mensaje: 'Carrito vaciado correctamente' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al vaciar carrito' });
    }
  }
}

module.exports = CarritoController;
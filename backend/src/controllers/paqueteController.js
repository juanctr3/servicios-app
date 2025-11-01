const PaqueteModel = require('../models/paqueteModel');
const ServicioModel = require('../models/servicioModel');

class PaqueteController {
  // Obtener todos los paquetes
  static async obtenerTodos(req, res) {
    try {
      const paquetes = await PaqueteModel.obtenerTodos();
      return res.json({ paquetes });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener paquetes' });
    }
  }

  // Obtener paquetes por servicio
  static async obtenerPorServicio(req, res) {
    try {
      const { servicio_id } = req.params;
      
      // Verificar que el servicio existe
      const servicio = await ServicioModel.obtenerPorId(servicio_id);
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      const paquetes = await PaqueteModel.obtenerPorServicio(servicio_id);
      return res.json({ paquetes });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener paquetes' });
    }
  }

  // Obtener paquete por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const paquete = await PaqueteModel.obtenerPorId(id);
      
      if (!paquete) {
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }
      
      return res.json({ paquete });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener paquete' });
    }
  }

  // Crear paquete (solo admin)
  static async crear(req, res) {
    try {
      const { servicio_id, nombre, cantidad, precio, descuento_porcentaje, es_popular } = req.body;

      // Validar
      if (!servicio_id || !nombre || !cantidad || !precio) {
        return res.status(400).json({ error: 'Servicio, nombre, cantidad y precio son requeridos' });
      }

      // Verificar que el servicio existe
      const servicio = await ServicioModel.obtenerPorId(servicio_id);
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      // Crear
      const paquete = await PaqueteModel.crear(
        servicio_id,
        nombre,
        cantidad,
        precio,
        descuento_porcentaje || 0,
        es_popular || false
      );

      return res.status(201).json({ 
        mensaje: 'Paquete creado correctamente',
        paquete 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al crear paquete' });
    }
  }

  // Actualizar paquete (solo admin)
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, cantidad, precio, descuento_porcentaje, es_popular } = req.body;

      // Validar
      if (!nombre || !cantidad || !precio) {
        return res.status(400).json({ error: 'Nombre, cantidad y precio son requeridos' });
      }

      // Verificar que existe
      const paqueteExistente = await PaqueteModel.obtenerPorId(id);
      if (!paqueteExistente) {
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }

      // Actualizar
      const paquete = await PaqueteModel.actualizar(
        id,
        nombre,
        cantidad,
        precio,
        descuento_porcentaje || 0,
        es_popular || false
      );

      return res.json({ 
        mensaje: 'Paquete actualizado correctamente',
        paquete 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al actualizar paquete' });
    }
  }

  // Eliminar paquete (solo admin)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que existe
      const paqueteExistente = await PaqueteModel.obtenerPorId(id);
      if (!paqueteExistente) {
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }

      // Eliminar
      await PaqueteModel.eliminar(id);

      return res.json({ mensaje: 'Paquete eliminado correctamente' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al eliminar paquete' });
    }
  }
}

module.exports = PaqueteController;
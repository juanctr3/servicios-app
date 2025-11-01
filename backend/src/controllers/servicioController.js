const ServicioModel = require('../models/servicioModel');
const CategoriaModel = require('../models/categoriaModel');

class ServicioController {
  // Obtener todos los servicios
  static async obtenerTodos(req, res) {
    try {
      const servicios = await ServicioModel.obtenerTodos();
      return res.json({ servicios });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener servicios' });
    }
  }

  // Obtener servicios por categoría
  static async obtenerPorCategoria(req, res) {
    try {
      const { categoria_id } = req.params;
      
      // Verificar que la categoría existe
      const categoria = await CategoriaModel.obtenerPorId(categoria_id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      const servicios = await ServicioModel.obtenerPorCategoria(categoria_id);
      return res.json({ servicios });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener servicios' });
    }
  }

  // Obtener servicio por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const servicio = await ServicioModel.obtenerPorId(id);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      return res.json({ servicio });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener servicio' });
    }
  }

  // Obtener servicio por slug
  static async obtenerPorSlug(req, res) {
    try {
      const { slug } = req.params;
      const servicio = await ServicioModel.obtenerPorSlug(slug);
      
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }
      
      return res.json({ servicio });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener servicio' });
    }
  }

  // Crear servicio (solo admin)
  static async crear(req, res) {
    try {
      const { categoria_id, nombre, descripcion, imagen_url, slug, rating, seo_title, seo_description } = req.body;

      // Validar
      if (!categoria_id || !nombre || !slug) {
        return res.status(400).json({ error: 'Categoría, nombre y slug son requeridos' });
      }

      // Verificar que la categoría existe
      const categoria = await CategoriaModel.obtenerPorId(categoria_id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      // Verificar si el slug ya existe
      const servicioExistente = await ServicioModel.obtenerPorSlug(slug);
      if (servicioExistente) {
        return res.status(400).json({ error: 'El slug ya existe' });
      }

      // Crear
      const servicio = await ServicioModel.crear(
        categoria_id,
        nombre,
        descripcion,
        imagen_url,
        slug,
        rating || 4.5,
        seo_title,
        seo_description
      );

      return res.status(201).json({ 
        mensaje: 'Servicio creado correctamente',
        servicio 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al crear servicio' });
    }
  }

  // Actualizar servicio (solo admin)
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { categoria_id, nombre, descripcion, imagen_url, slug, rating, seo_title, seo_description } = req.body;

      // Validar
      if (!categoria_id || !nombre || !slug) {
        return res.status(400).json({ error: 'Categoría, nombre y slug son requeridos' });
      }

      // Verificar que existe el servicio
      const servicioExistente = await ServicioModel.obtenerPorId(id);
      if (!servicioExistente) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      // Verificar que la categoría existe
      const categoria = await CategoriaModel.obtenerPorId(categoria_id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      // Actualizar
      const servicio = await ServicioModel.actualizar(
        id,
        categoria_id,
        nombre,
        descripcion,
        imagen_url,
        slug,
        rating || 4.5,
        seo_title,
        seo_description
      );

      return res.json({ 
        mensaje: 'Servicio actualizado correctamente',
        servicio 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al actualizar servicio' });
    }
  }

  // Eliminar servicio (solo admin)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que existe
      const servicioExistente = await ServicioModel.obtenerPorId(id);
      if (!servicioExistente) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      // Eliminar
      await ServicioModel.eliminar(id);

      return res.json({ mensaje: 'Servicio eliminado correctamente' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al eliminar servicio' });
    }
  }
}

module.exports = ServicioController;
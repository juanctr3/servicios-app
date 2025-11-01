const CategoriaModel = require('../models/categoriaModel');

class CategoriaController {
  // Obtener todas las categorías
  static async obtenerTodas(req, res) {
    try {
      const categorias = await CategoriaModel.obtenerTodas();
      return res.json({ categorias });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }
  }

  // Obtener categoría por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await CategoriaModel.obtenerPorId(id);
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      return res.json({ categoria });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener categoría' });
    }
  }

  // Obtener categoría por slug
  static async obtenerPorSlug(req, res) {
    try {
      const { slug } = req.params;
      const categoria = await CategoriaModel.obtenerPorSlug(slug);
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      return res.json({ categoria });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al obtener categoría' });
    }
  }

  // Crear categoría (solo admin)
  static async crear(req, res) {
    try {
      const { nombre, descripcion, imagen_url, slug, seo_title, seo_description, icono } = req.body;

      // Validar
      if (!nombre || !slug) {
        return res.status(400).json({ error: 'Nombre y slug son requeridos' });
      }

      // Verificar si el slug ya existe
      const categoriaExistente = await CategoriaModel.obtenerPorSlug(slug);
      if (categoriaExistente) {
        return res.status(400).json({ error: 'El slug ya existe' });
      }

      // Crear
      const categoria = await CategoriaModel.crear(
        nombre,
        descripcion,
        imagen_url,
        slug,
        seo_title,
        seo_description,
        icono
      );

      return res.status(201).json({ 
        mensaje: 'Categoría creada correctamente',
        categoria 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al crear categoría' });
    }
  }

  // Actualizar categoría (solo admin)
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, imagen_url, slug, seo_title, seo_description, icono } = req.body;

      // Validar
      if (!nombre || !slug) {
        return res.status(400).json({ error: 'Nombre y slug son requeridos' });
      }

      // Verificar que existe
      const categoriaExistente = await CategoriaModel.obtenerPorId(id);
      if (!categoriaExistente) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      // Actualizar
      const categoria = await CategoriaModel.actualizar(
        id,
        nombre,
        descripcion,
        imagen_url,
        slug,
        seo_title,
        seo_description,
        icono
      );

      return res.json({ 
        mensaje: 'Categoría actualizada correctamente',
        categoria 
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al actualizar categoría' });
    }
  }

  // Eliminar categoría (solo admin)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que existe
      const categoriaExistente = await CategoriaModel.obtenerPorId(id);
      if (!categoriaExistente) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      // Eliminar
      await CategoriaModel.eliminar(id);

      return res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error al eliminar categoría' });
    }
  }
}

module.exports = CategoriaController;
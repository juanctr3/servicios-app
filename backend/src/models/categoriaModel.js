const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CategoriaModel {
  // Obtener todas las categorías
  static async obtenerTodas() {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM categorias ORDER BY nombre ASC'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener categoría por ID
  static async obtenerPorId(id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM categorias WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Obtener categoría por slug
  static async obtenerPorSlug(slug) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM categorias WHERE slug = ?',
        [slug]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Crear categoría
  static async crear(nombre, descripcion, imagen_url, slug, seo_title, seo_description, icono) {
    const connection = await pool.getConnection();
    
    try {
      const id = uuidv4();
      
      await connection.query(
        'INSERT INTO categorias (id, nombre, descripcion, imagen_url, slug, seo_title, seo_description, icono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, nombre, descripcion, imagen_url, slug, seo_title, seo_description, icono]
      );
      
      return { id, nombre, slug };
    } finally {
      connection.release();
    }
  }

  // Actualizar categoría
  static async actualizar(id, nombre, descripcion, imagen_url, slug, seo_title, seo_description, icono) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'UPDATE categorias SET nombre = ?, descripcion = ?, imagen_url = ?, slug = ?, seo_title = ?, seo_description = ?, icono = ? WHERE id = ?',
        [nombre, descripcion, imagen_url, slug, seo_title, seo_description, icono, id]
      );
      
      return { id, nombre, slug };
    } finally {
      connection.release();
    }
  }

  // Eliminar categoría
  static async eliminar(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'DELETE FROM categorias WHERE id = ?',
        [id]
      );
      
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = CategoriaModel;
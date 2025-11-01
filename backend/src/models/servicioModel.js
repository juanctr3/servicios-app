const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ServicioModel {
  // Obtener todos los servicios
  static async obtenerTodos() {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM servicios ORDER BY nombre ASC'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener servicios por categoría
  static async obtenerPorCategoria(categoria_id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM servicios WHERE categoria_id = ? ORDER BY nombre ASC',
        [categoria_id]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener servicio por ID
  static async obtenerPorId(id) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM servicios WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Obtener servicio por slug
  static async obtenerPorSlug(slug) {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM servicios WHERE slug = ?',
        [slug]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Crear servicio
  static async crear(categoria_id, nombre, descripcion, imagen_url, slug, rating, seo_title, seo_description) {
    const connection = await pool.getConnection();
    
    try {
      const id = uuidv4();
      
      await connection.query(
        'INSERT INTO servicios (id, categoria_id, nombre, descripcion, imagen_url, slug, rating, seo_title, seo_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, categoria_id, nombre, descripcion, imagen_url, slug, rating, seo_title, seo_description]
      );
      
      return { id, nombre, slug };
    } finally {
      connection.release();
    }
  }

  // Actualizar servicio
  static async actualizar(id, categoria_id, nombre, descripcion, imagen_url, slug, rating, seo_title, seo_description) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'UPDATE servicios SET categoria_id = ?, nombre = ?, descripcion = ?, imagen_url = ?, slug = ?, rating = ?, seo_title = ?, seo_description = ? WHERE id = ?',
        [categoria_id, nombre, descripcion, imagen_url, slug, rating, seo_title, seo_description, id]
      );
      
      return { id, nombre, slug };
    } finally {
      connection.release();
    }
  }

  // Eliminar servicio
  static async eliminar(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        'DELETE FROM servicios WHERE id = ?',
        [id]
      );
      
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = ServicioModel;
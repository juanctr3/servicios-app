const pool = require('../config/database');

class ServicioController {
  // Obtener todos los servicios (público)
  static async obtenerTodos(req, res) {
    try {
      console.log('🛎️ GET /servicios - Obteniendo todos los servicios');
      
      const connection = await pool.getConnection();
      
      const [servicios] = await connection.query(
        `SELECT 
          id, 
          categoria_id,
          nombre, 
          descripcion, 
          slug,
          imagen_url,
          rating,
          seo_title,
          seo_description,
          palabras_clave,
          alt_imagen,
          h1_titulo,
          contenido_largo,
          created_at
        FROM servicios 
        ORDER BY nombre ASC`
      );
      
      connection.release();
      
      console.log(`✅ Se encontraron ${servicios.length} servicios`);
      
      return res.json({ 
        servicios,
        total: servicios.length 
      });
    } catch (error) {
      console.error('❌ Error en obtenerTodos:', error);
      return res.status(500).json({ error: 'Error al obtener servicios', detalles: error.message });
    }
  }

  // Obtener servicios por categoría
  static async obtenerPorCategoria(req, res) {
    try {
      const { categoriaId } = req.params;
      console.log(`🛎️ GET /servicios/categoria/${categoriaId} - Obteniendo servicios por categoría`);
      
      const connection = await pool.getConnection();
      
      const [servicios] = await connection.query(
        `SELECT 
          id, 
          categoria_id,
          nombre, 
          descripcion, 
          slug,
          imagen_url,
          rating,
          seo_title,
          seo_description,
          palabras_clave,
          alt_imagen,
          h1_titulo,
          contenido_largo,
          created_at
        FROM servicios 
        WHERE categoria_id = ?
        ORDER BY nombre ASC`,
        [categoriaId]
      );
      
      connection.release();
      
      console.log(`✅ Se encontraron ${servicios.length} servicios en la categoría`);
      
      return res.json({ 
        servicios,
        total: servicios.length 
      });
    } catch (error) {
      console.error('❌ Error en obtenerPorCategoria:', error);
      return res.status(500).json({ error: 'Error al obtener servicios', detalles: error.message });
    }
  }

  // Obtener servicio por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      console.log(`🛎️ GET /servicios/${id} - Obteniendo servicio por ID`);
      
      const connection = await pool.getConnection();
      
      const [rows] = await connection.query(
        `SELECT 
          id, 
          categoria_id,
          nombre, 
          descripcion, 
          slug,
          imagen_url,
          rating,
          seo_title,
          seo_description,
          palabras_clave,
          alt_imagen,
          h1_titulo,
          contenido_largo,
          created_at
        FROM servicios 
        WHERE id = ?`,
        [id]
      );
      
      connection.release();
      
      if (rows.length === 0) {
        console.log(`⚠️ Servicio ${id} no encontrado`);
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      console.log(`✅ Servicio ${id} obtenido correctamente`);
      return res.json({ servicio: rows[0] });
    } catch (error) {
      console.error('❌ Error en obtenerPorId:', error);
      return res.status(500).json({ error: 'Error al obtener servicio', detalles: error.message });
    }
  }

  // Obtener servicio por slug (SEO)
  static async obtenerPorSlug(req, res) {
    try {
      const { slug } = req.params;
      console.log(`🛎️ GET /servicios/slug/${slug} - Obteniendo servicio por slug`);
      
      const connection = await pool.getConnection();
      
      const [rows] = await connection.query(
        `SELECT 
          id, 
          categoria_id,
          nombre, 
          descripcion, 
          slug,
          imagen_url,
          rating,
          seo_title,
          seo_description,
          palabras_clave,
          alt_imagen,
          h1_titulo,
          contenido_largo,
          created_at
        FROM servicios 
        WHERE slug = ?`,
        [slug]
      );
      
      connection.release();
      
      if (rows.length === 0) {
        console.log(`⚠️ Servicio con slug ${slug} no encontrado`);
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      console.log(`✅ Servicio con slug ${slug} obtenido correctamente`);
      return res.json({ servicio: rows[0] });
    } catch (error) {
      console.error('❌ Error en obtenerPorSlug:', error);
      return res.status(500).json({ error: 'Error al obtener servicio', detalles: error.message });
    }
  }

  // Crear servicio (admin)
  static async crear(req, res) {
    try {
      console.log('📝 POST /servicios - Creando nuevo servicio');
      console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      const { 
        categoria_id,
        nombre, 
        descripcion,
        slug,
        imagen_url,
        rating,
        seo_title,
        seo_description,
        palabras_clave,
        alt_imagen,
        h1_titulo,
        contenido_largo
      } = req.body;

      // Validar campos obligatorios
      if (!categoria_id || !nombre || !slug) {
        console.log('⚠️ Validación fallida: campos obligatorios vacíos');
        return res.status(400).json({ error: 'Categoría, nombre y slug son requeridos' });
      }

      if (!seo_title || !seo_description || !alt_imagen) {
        console.log('⚠️ Validación fallida: campos SEO vacíos');
        return res.status(400).json({ error: 'Meta title, meta description y alt image son requeridos para SEO' });
      }

      // Validar longitud SEO
      if (seo_title.length > 60) {
        return res.status(400).json({ error: 'Meta title no debe exceder 60 caracteres' });
      }

      if (seo_description.length > 160) {
        return res.status(400).json({ error: 'Meta description no debe exceder 160 caracteres' });
      }

      const connection = await pool.getConnection();

      // Verificar si el slug ya existe
      const [existing] = await connection.query(
        'SELECT id FROM servicios WHERE slug = ?',
        [slug]
      );

      if (existing.length > 0) {
        connection.release();
        return res.status(400).json({ error: `El slug "${slug}" ya existe` });
      }

      // Generar ID único
      const id = 'serv-' + Date.now();

      // Insertar en la BD
      await connection.query(
        `INSERT INTO servicios 
          (id, categoria_id, nombre, descripcion, slug, imagen_url, rating, seo_title, seo_description, palabras_clave, alt_imagen, h1_titulo, contenido_largo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          id,
          categoria_id,
          nombre, 
          descripcion,
          slug,
          imagen_url || 'https://via.placeholder.com/1200x630',
          rating || 5,
          seo_title,
          seo_description,
          palabras_clave || '',
          alt_imagen,
          h1_titulo || nombre,
          contenido_largo || ''
        ]
      );
      
      connection.release();

      console.log(`✅ Servicio "${nombre}" creado correctamente con ID ${id}`);

      return res.json({ 
        mensaje: 'Servicio creado correctamente con SEO optimizado',
        id
      });
    } catch (error) {
      console.error('❌ Error en crear:', error);
      return res.status(500).json({ error: 'Error al crear servicio', detalles: error.message });
    }
  }

  // Actualizar servicio (admin)
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      console.log(`✏️ PUT /servicios/${id} - Actualizando servicio`);
      console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      const { 
        categoria_id,
        nombre, 
        descripcion,
        slug,
        imagen_url,
        rating,
        seo_title,
        seo_description,
        palabras_clave,
        alt_imagen,
        h1_titulo,
        contenido_largo
      } = req.body;

      // Validar campos obligatorios
      if (!categoria_id || !nombre || !slug) {
        return res.status(400).json({ error: 'Categoría, nombre y slug son requeridos' });
      }

      if (!seo_title || !seo_description || !alt_imagen) {
        return res.status(400).json({ error: 'Meta title, meta description y alt image son requeridos para SEO' });
      }

      // Validar longitud SEO
      if (seo_title.length > 60) {
        return res.status(400).json({ error: 'Meta title no debe exceder 60 caracteres' });
      }

      if (seo_description.length > 160) {
        return res.status(400).json({ error: 'Meta description no debe exceder 160 caracteres' });
      }

      const connection = await pool.getConnection();

      // Verificar si el nuevo slug ya existe en otro servicio
      const [existing] = await connection.query(
        'SELECT id FROM servicios WHERE slug = ? AND id != ?',
        [slug, id]
      );

      if (existing.length > 0) {
        connection.release();
        return res.status(400).json({ error: `El slug "${slug}" ya existe` });
      }

      // Actualizar en la BD
      await connection.query(
        `UPDATE servicios SET 
          categoria_id = ?,
          nombre = ?, 
          descripcion = ?,
          slug = ?,
          imagen_url = ?,
          rating = ?,
          seo_title = ?,
          seo_description = ?,
          palabras_clave = ?,
          alt_imagen = ?,
          h1_titulo = ?,
          contenido_largo = ?
        WHERE id = ?`,
        [
          categoria_id,
          nombre, 
          descripcion,
          slug,
          imagen_url || 'https://via.placeholder.com/1200x630',
          rating || 5,
          seo_title,
          seo_description,
          palabras_clave || '',
          alt_imagen,
          h1_titulo || nombre,
          contenido_largo || '',
          id
        ]
      );
      
      connection.release();

      console.log(`✅ Servicio ${id} actualizado correctamente`);

      return res.json({ 
        mensaje: 'Servicio actualizado correctamente con SEO optimizado'
      });
    } catch (error) {
      console.error('❌ Error en actualizar:', error);
      return res.status(500).json({ error: 'Error al actualizar servicio', detalles: error.message });
    }
  }

  // Eliminar servicio (admin)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      console.log(`🗑️ DELETE /servicios/${id} - Eliminando servicio`);

      const connection = await pool.getConnection();

      // Verificar si hay paquetes asociados
      const [paquetes] = await connection.query(
        'SELECT COUNT(*) as count FROM paquetes WHERE servicio_id = ?',
        [id]
      );

      if (paquetes[0].count > 0) {
        connection.release();
        return res.status(400).json({ 
          error: `No se puede eliminar este servicio porque tiene ${paquetes[0].count} paquete(s) asociado(s)`
        });
      }

      // Eliminar el servicio
      await connection.query('DELETE FROM servicios WHERE id = ?', [id]);
      connection.release();

      console.log(`✅ Servicio ${id} eliminado correctamente`);

      return res.json({ 
        mensaje: 'Servicio eliminado correctamente'
      });
    } catch (error) {
      console.error('❌ Error en eliminar:', error);
      return res.status(500).json({ error: 'Error al eliminar servicio', detalles: error.message });
    }
  }
}

module.exports = ServicioController;
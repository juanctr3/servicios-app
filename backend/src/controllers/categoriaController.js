const pool = require('../config/database');

class CategoriaController {
  // Obtener todas las categorías (público)
  static async obtenerTodas(req, res) {
    try {
      console.log('📂 GET /categorias - Obteniendo todas las categorías');
      
      const connection = await pool.getConnection();
      
      const [categorias] = await connection.query(
        `SELECT 
          id, 
          nombre, 
          descripcion, 
          slug, 
          icono, 
          imagen_url,
          seo_title,
          seo_description,
          palabras_clave,
          alt_imagen,
          h1_titulo,
          contenido_largo,
          created_at
        FROM categorias 
        ORDER BY nombre ASC`
      );
      
      connection.release();
      
      console.log(`✅ Se encontraron ${categorias.length} categorías`);
      
      return res.json({ 
        categorias,
        total: categorias.length 
      });
    } catch (error) {
      console.error('❌ Error en obtenerTodas:', error);
      return res.status(500).json({ error: 'Error al obtener categorías', detalles: error.message });
    }
  }

  // Obtener categoría por ID (para edición en admin)
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      console.log(`📂 GET /categorias/${id} - Obteniendo categoría por ID`);
      
      const connection = await pool.getConnection();
      
      const [rows] = await connection.query(
        `SELECT 
          id, 
          nombre, 
          descripcion, 
          slug, 
          icono, 
          imagen_url,
          seo_title,
          seo_description,
          palabras_clave,
          alt_imagen,
          h1_titulo,
          contenido_largo,
          created_at
        FROM categorias 
        WHERE id = ?`,
        [id]
      );
      
      connection.release();
      
      if (rows.length === 0) {
        console.log(`⚠️ Categoría ${id} no encontrada`);
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      console.log(`✅ Categoría ${id} obtenida correctamente`);
      return res.json({ categoria: rows[0] });
    } catch (error) {
      console.error('❌ Error en obtenerPorId:', error);
      return res.status(500).json({ error: 'Error al obtener categoría', detalles: error.message });
    }
  }

  // Obtener categoría por slug (público - para SEO)
  static async obtenerPorSlug(req, res) {
    try {
      const { slug } = req.params;
      console.log(`📂 GET /categorias/slug/${slug} - Obteniendo categoría por slug`);
      
      const connection = await pool.getConnection();
      
      const [rows] = await connection.query(
        `SELECT 
          id, 
          nombre, 
          descripcion, 
          slug, 
          icono, 
          imagen_url,
          seo_title,
          seo_description,
          palabras_clave,
          alt_imagen,
          h1_titulo,
          contenido_largo,
          created_at
        FROM categorias 
        WHERE slug = ?`,
        [slug]
      );
      
      connection.release();
      
      if (rows.length === 0) {
        console.log(`⚠️ Categoría con slug ${slug} no encontrada`);
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      console.log(`✅ Categoría con slug ${slug} obtenida correctamente`);
      return res.json({ categoria: rows[0] });
    } catch (error) {
      console.error('❌ Error en obtenerPorSlug:', error);
      return res.status(500).json({ error: 'Error al obtener categoría', detalles: error.message });
    }
  }

  // Crear categoría (admin)
  static async crear(req, res) {
    try {
      console.log('📝 POST /categorias - Creando nueva categoría');
      console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      const { 
        nombre, 
        descripcion, 
        slug, 
        icono, 
        imagen_url,
        seo_title,
        seo_description,
        palabras_clave,
        alt_imagen,
        h1_titulo,
        contenido_largo
      } = req.body;

      // Validar campos obligatorios
      if (!nombre || nombre.trim() === '') {
        console.log('⚠️ Validación fallida: nombre vacío');
        return res.status(400).json({ error: 'El nombre es requerido' });
      }

      if (!slug || slug.trim() === '') {
        console.log('⚠️ Validación fallida: slug vacío');
        return res.status(400).json({ error: 'El slug es requerido' });
      }

      if (!seo_title || seo_title.trim() === '') {
        console.log('⚠️ Validación fallida: seo_title vacío');
        return res.status(400).json({ error: 'Meta title es requerido para SEO' });
      }

      if (!seo_description || seo_description.trim() === '') {
        console.log('⚠️ Validación fallida: seo_description vacío');
        return res.status(400).json({ error: 'Meta description es requerida para SEO' });
      }

      if (!alt_imagen || alt_imagen.trim() === '') {
        console.log('⚠️ Validación fallida: alt_imagen vacío');
        return res.status(400).json({ error: 'Alt text de imagen es requerido para SEO' });
      }

      // Validar longitud de campos SEO
      if (seo_title.length > 60) {
        console.log(`⚠️ Validación fallida: seo_title muy largo (${seo_title.length}/60)`);
        return res.status(400).json({ error: 'Meta title no debe exceder 60 caracteres' });
      }

      if (seo_description.length > 160) {
        console.log(`⚠️ Validación fallida: seo_description muy largo (${seo_description.length}/160)`);
        return res.status(400).json({ error: 'Meta description no debe exceder 160 caracteres' });
      }

      const connection = await pool.getConnection();
      
      console.log(`🔍 Verificando si slug "${slug}" ya existe...`);
      
      // Verificar si el slug ya existe
      const [existing] = await connection.query(
        'SELECT id FROM categorias WHERE slug = ?',
        [slug]
      );

      if (existing.length > 0) {
        console.log(`⚠️ Slug "${slug}" ya existe`);
        connection.release();
        return res.status(400).json({ error: `El slug "${slug}" ya existe. Usa otro diferente.` });
      }

      console.log(`✅ Slug "${slug}" está disponible`);

      // Generar ID único
      const id = 'cat-' + Date.now();
      console.log(`📌 ID generado: ${id}`);

      console.log('💾 Insertando categoría en la BD...');

      // Insertar en la BD
      await connection.query(
        `INSERT INTO categorias 
          (id, nombre, descripcion, slug, icono, imagen_url, seo_title, seo_description, palabras_clave, alt_imagen, h1_titulo, contenido_largo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          id,
          nombre, 
          descripcion, 
          slug, 
          icono, 
          imagen_url || 'https://via.placeholder.com/1200x630',
          seo_title,
          seo_description,
          palabras_clave || '',
          alt_imagen,
          h1_titulo || nombre,
          contenido_largo || ''
        ]
      );
      
      connection.release();

      console.log(`✅ Categoría "${nombre}" creada correctamente con ID ${id}`);

      return res.json({ 
        mensaje: 'Categoría creada correctamente con SEO optimizado',
        id,
        categoria: {
          id,
          nombre,
          slug,
          icono
        }
      });
    } catch (error) {
      console.error('❌ Error en crear:', error);
      console.error('Stack:', error.stack);
      return res.status(500).json({ error: 'Error al crear categoría', detalles: error.message });
    }
  }

  // Actualizar categoría (admin)
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      console.log(`✏️ PUT /categorias/${id} - Actualizando categoría`);
      console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      const { 
        nombre, 
        descripcion, 
        slug, 
        icono, 
        imagen_url,
        seo_title,
        seo_description,
        palabras_clave,
        alt_imagen,
        h1_titulo,
        contenido_largo
      } = req.body;

      // Validar campos obligatorios
      if (!nombre || nombre.trim() === '') {
        console.log('⚠️ Validación fallida: nombre vacío');
        return res.status(400).json({ error: 'El nombre es requerido' });
      }

      if (!slug || slug.trim() === '') {
        console.log('⚠️ Validación fallida: slug vacío');
        return res.status(400).json({ error: 'El slug es requerido' });
      }

      if (!seo_title || seo_title.trim() === '') {
        console.log('⚠️ Validación fallida: seo_title vacío');
        return res.status(400).json({ error: 'Meta title es requerido para SEO' });
      }

      if (!seo_description || seo_description.trim() === '') {
        console.log('⚠️ Validación fallida: seo_description vacío');
        return res.status(400).json({ error: 'Meta description es requerida para SEO' });
      }

      if (!alt_imagen || alt_imagen.trim() === '') {
        console.log('⚠️ Validación fallida: alt_imagen vacío');
        return res.status(400).json({ error: 'Alt text de imagen es requerido para SEO' });
      }

      // Validar longitud de campos SEO
      if (seo_title.length > 60) {
        console.log(`⚠️ Validación fallida: seo_title muy largo (${seo_title.length}/60)`);
        return res.status(400).json({ error: 'Meta title no debe exceder 60 caracteres' });
      }

      if (seo_description.length > 160) {
        console.log(`⚠️ Validación fallida: seo_description muy largo (${seo_description.length}/160)`);
        return res.status(400).json({ error: 'Meta description no debe exceder 160 caracteres' });
      }

      const connection = await pool.getConnection();

      console.log(`🔍 Verificando si nuevo slug "${slug}" ya existe en otra categoría...`);

      // Verificar si el nuevo slug ya existe en otra categoría
      const [existing] = await connection.query(
        'SELECT id FROM categorias WHERE slug = ? AND id != ?',
        [slug, id]
      );

      if (existing.length > 0) {
        console.log(`⚠️ Slug "${slug}" ya existe en otra categoría`);
        connection.release();
        return res.status(400).json({ error: `El slug "${slug}" ya existe. Usa otro diferente.` });
      }

      console.log(`✅ Slug "${slug}" está disponible`);
      console.log('💾 Actualizando categoría en la BD...');

      // Actualizar en la BD
      await connection.query(
        `UPDATE categorias SET 
          nombre = ?, 
          descripcion = ?, 
          slug = ?, 
          icono = ?, 
          imagen_url = ?,
          seo_title = ?,
          seo_description = ?,
          palabras_clave = ?,
          alt_imagen = ?,
          h1_titulo = ?,
          contenido_largo = ?
        WHERE id = ?`,
        [
          nombre, 
          descripcion, 
          slug, 
          icono, 
          imagen_url || 'https://via.placeholder.com/1200x630',
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

      console.log(`✅ Categoría ${id} actualizada correctamente`);

      return res.json({ 
        mensaje: 'Categoría actualizada correctamente con SEO optimizado'
      });
    } catch (error) {
      console.error('❌ Error en actualizar:', error);
      console.error('Stack:', error.stack);
      return res.status(500).json({ error: 'Error al actualizar categoría', detalles: error.message });
    }
  }

  // Eliminar categoría (admin)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      console.log(`🗑️ DELETE /categorias/${id} - Eliminando categoría`);

      const connection = await pool.getConnection();

      console.log(`🔍 Verificando servicios asociados...`);

      // Verificar si hay servicios asociados
      const [servicios] = await connection.query(
        'SELECT COUNT(*) as count FROM servicios WHERE categoria_id = ?',
        [id]
      );

      if (servicios[0].count > 0) {
        console.log(`⚠️ La categoría tiene ${servicios[0].count} servicio(s) asociado(s)`);
        connection.release();
        return res.status(400).json({ 
          error: `No se puede eliminar esta categoría porque tiene ${servicios[0].count} servicio(s) asociado(s). Elimina primero los servicios.`
        });
      }

      console.log('💾 Eliminando la categoría de la BD...');

      // Eliminar la categoría
      const result = await connection.query('DELETE FROM categorias WHERE id = ?', [id]);
      connection.release();

      console.log(`✅ Categoría ${id} eliminada correctamente`);

      return res.json({ 
        mensaje: 'Categoría eliminada correctamente'
      });
    } catch (error) {
      console.error('❌ Error en eliminar:', error);
      console.error('Stack:', error.stack);
      return res.status(500).json({ error: 'Error al eliminar categoría', detalles: error.message });
    }
  }

  // Contar servicios por categoría
  static async contarServicios(req, res) {
    try {
      const { id } = req.params;
      console.log(`📊 GET /categorias/${id}/servicios/count - Contando servicios`);
      
      const connection = await pool.getConnection();
      
      const [result] = await connection.query(
        'SELECT COUNT(*) as count FROM servicios WHERE categoria_id = ?',
        [id]
      );
      
      connection.release();

      console.log(`✅ Categoría ${id} tiene ${result[0].count} servicios`);

      return res.json({ 
        categoria_id: id,
        servicios_count: result[0].count
      });
    } catch (error) {
      console.error('❌ Error en contarServicios:', error);
      return res.status(500).json({ error: 'Error al contar servicios', detalles: error.message });
    }
  }
}

module.exports = CategoriaController;
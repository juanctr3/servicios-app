const pool = require('../config/database');

class PaqueteController {
  // Obtener todos los paquetes
  static async obtenerTodos(req, res) {
    try {
      console.log('📦 GET /paquetes - Obteniendo todos los paquetes');
      
      const connection = await pool.getConnection();
      
      const [paquetes] = await connection.query(
        `SELECT 
          id, 
          servicio_id,
          nombre, 
          cantidad,
          precio,
          descuento_porcentaje,
          descripcion_detallada,
          caracteristicas,
          es_popular,
          es_mas_vendido,
          created_at
        FROM paquetes 
        ORDER BY servicio_id, precio ASC`
      );
      
      connection.release();
      
      console.log(`✅ Se encontraron ${paquetes.length} paquetes`);
      
      return res.json({ 
        paquetes,
        total: paquetes.length 
      });
    } catch (error) {
      console.error('❌ Error en obtenerTodos:', error);
      return res.status(500).json({ error: 'Error al obtener paquetes', detalles: error.message });
    }
  }

  // Obtener paquetes por servicio
  static async obtenerPorServicio(req, res) {
    try {
      const { servicioId } = req.params;
      console.log(`📦 GET /paquetes/servicio/${servicioId} - Obteniendo paquetes por servicio`);
      
      const connection = await pool.getConnection();
      
      const [paquetes] = await connection.query(
        `SELECT 
          id, 
          servicio_id,
          nombre, 
          cantidad,
          precio,
          descuento_porcentaje,
          descripcion_detallada,
          caracteristicas,
          es_popular,
          es_mas_vendido,
          created_at
        FROM paquetes 
        WHERE servicio_id = ?
        ORDER BY precio ASC`,
        [servicioId]
      );
      
      connection.release();
      
      console.log(`✅ Se encontraron ${paquetes.length} paquetes para el servicio`);
      
      return res.json({ 
        paquetes,
        total: paquetes.length 
      });
    } catch (error) {
      console.error('❌ Error en obtenerPorServicio:', error);
      return res.status(500).json({ error: 'Error al obtener paquetes', detalles: error.message });
    }
  }

  // Obtener paquete por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      console.log(`📦 GET /paquetes/${id} - Obteniendo paquete por ID`);
      
      const connection = await pool.getConnection();
      
      const [rows] = await connection.query(
        `SELECT 
          id, 
          servicio_id,
          nombre, 
          cantidad,
          precio,
          descuento_porcentaje,
          descripcion_detallada,
          caracteristicas,
          es_popular,
          es_mas_vendido,
          created_at
        FROM paquetes 
        WHERE id = ?`,
        [id]
      );
      
      connection.release();
      
      if (rows.length === 0) {
        console.log(`⚠️ Paquete ${id} no encontrado`);
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }

      console.log(`✅ Paquete ${id} obtenido correctamente`);
      return res.json({ paquete: rows[0] });
    } catch (error) {
      console.error('❌ Error en obtenerPorId:', error);
      return res.status(500).json({ error: 'Error al obtener paquete', detalles: error.message });
    }
  }

  // Crear paquete (admin)
  static async crear(req, res) {
    try {
      console.log('📝 POST /paquetes - Creando nuevo paquete');
      console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      const { 
        servicio_id,
        nombre, 
        cantidad,
        precio,
        descuento_porcentaje,
        descripcion_detallada,
        caracteristicas,
        es_popular,
        es_mas_vendido
      } = req.body;

      // Validar campos obligatorios
      if (!servicio_id || !nombre || !cantidad || !precio) {
        console.log('⚠️ Validación fallida: campos obligatorios vacíos');
        return res.status(400).json({ 
          error: 'Servicio, nombre, cantidad y precio son requeridos' 
        });
      }

      if (precio < 0) {
        return res.status(400).json({ error: 'El precio no puede ser negativo' });
      }

      const connection = await pool.getConnection();

      // Generar ID único
      const id = 'paq-' + Date.now();

      // Insertar en la BD
      await connection.query(
        `INSERT INTO paquetes 
          (id, servicio_id, nombre, cantidad, precio, descuento_porcentaje, descripcion_detallada, caracteristicas, es_popular, es_mas_vendido, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          id,
          servicio_id,
          nombre, 
          cantidad,
          precio,
          descuento_porcentaje || 0,
          descripcion_detallada || '',
          caracteristicas ? JSON.stringify(caracteristicas) : JSON.stringify([]),
          es_popular || false,
          es_mas_vendido || false
        ]
      );
      
      connection.release();

      console.log(`✅ Paquete "${nombre}" creado correctamente con ID ${id}`);

      return res.json({ 
        mensaje: 'Paquete creado correctamente',
        id
      });
    } catch (error) {
      console.error('❌ Error en crear:', error);
      return res.status(500).json({ error: 'Error al crear paquete', detalles: error.message });
    }
  }

  // Actualizar paquete (admin)
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      console.log(`✏️ PUT /paquetes/${id} - Actualizando paquete`);
      console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
      
      const { 
        servicio_id,
        nombre, 
        cantidad,
        precio,
        descuento_porcentaje,
        descripcion_detallada,
        caracteristicas,
        es_popular,
        es_mas_vendido
      } = req.body;

      // Validar campos obligatorios
      if (!servicio_id || !nombre || !cantidad || !precio) {
        return res.status(400).json({ 
          error: 'Servicio, nombre, cantidad y precio son requeridos' 
        });
      }

      if (precio < 0) {
        return res.status(400).json({ error: 'El precio no puede ser negativo' });
      }

      const connection = await pool.getConnection();

      // Actualizar en la BD
      await connection.query(
        `UPDATE paquetes SET 
          servicio_id = ?,
          nombre = ?, 
          cantidad = ?,
          precio = ?,
          descuento_porcentaje = ?,
          descripcion_detallada = ?,
          caracteristicas = ?,
          es_popular = ?,
          es_mas_vendido = ?
        WHERE id = ?`,
        [
          servicio_id,
          nombre, 
          cantidad,
          precio,
          descuento_porcentaje || 0,
          descripcion_detallada || '',
          caracteristicas ? JSON.stringify(caracteristicas) : JSON.stringify([]),
          es_popular || false,
          es_mas_vendido || false,
          id
        ]
      );
      
      connection.release();

      console.log(`✅ Paquete ${id} actualizado correctamente`);

      return res.json({ 
        mensaje: 'Paquete actualizado correctamente'
      });
    } catch (error) {
      console.error('❌ Error en actualizar:', error);
      return res.status(500).json({ error: 'Error al actualizar paquete', detalles: error.message });
    }
  }

  // Eliminar paquete (admin)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      console.log(`🗑️ DELETE /paquetes/${id} - Eliminando paquete`);

      const connection = await pool.getConnection();

      // Verificar si hay pedidos asociados
      const [pedidos] = await connection.query(
        'SELECT COUNT(*) as count FROM pedido_detalles WHERE paquete_id = ?',
        [id]
      );

      if (pedidos[0].count > 0) {
        connection.release();
        return res.status(400).json({ 
          error: `No se puede eliminar este paquete porque tiene ${pedidos[0].count} pedido(s) asociado(s)`
        });
      }

      // Eliminar el paquete
      await connection.query('DELETE FROM paquetes WHERE id = ?', [id]);
      connection.release();

      console.log(`✅ Paquete ${id} eliminado correctamente`);

      return res.json({ 
        mensaje: 'Paquete eliminado correctamente'
      });
    } catch (error) {
      console.error('❌ Error en eliminar:', error);
      return res.status(500).json({ error: 'Error al eliminar paquete', detalles: error.message });
    }
  }

  // Marcar paquete como popular
  static async marcarPopular(req, res) {
    try {
      const { id } = req.params;
      const { es_popular } = req.body;
      
      console.log(`⭐ PATCH /paquetes/${id}/popular - Marcando como ${es_popular ? 'popular' : 'no popular'}`);

      const connection = await pool.getConnection();

      await connection.query(
        'UPDATE paquetes SET es_popular = ? WHERE id = ?',
        [es_popular || false, id]
      );
      
      connection.release();

      console.log(`✅ Paquete ${id} marcado como ${es_popular ? 'popular' : 'no popular'}`);

      return res.json({ 
        mensaje: `Paquete marcado como ${es_popular ? 'popular' : 'no popular'}`
      });
    } catch (error) {
      console.error('❌ Error en marcarPopular:', error);
      return res.status(500).json({ error: 'Error al marcar paquete', detalles: error.message });
    }
  }

  // Marcar paquete como más vendido
  static async marcarMasVendido(req, res) {
    try {
      const { id } = req.params;
      const { es_mas_vendido } = req.body;
      
      console.log(`🔥 PATCH /paquetes/${id}/mas-vendido - Marcando como ${es_mas_vendido ? 'más vendido' : 'no más vendido'}`);

      const connection = await pool.getConnection();

      await connection.query(
        'UPDATE paquetes SET es_mas_vendido = ? WHERE id = ?',
        [es_mas_vendido || false, id]
      );
      
      connection.release();

      console.log(`✅ Paquete ${id} marcado como ${es_mas_vendido ? 'más vendido' : 'no más vendido'}`);

      return res.json({ 
        mensaje: `Paquete marcado como ${es_mas_vendido ? 'más vendido' : 'no más vendido'}`
      });
    } catch (error) {
      console.error('❌ Error en marcarMasVendido:', error);
      return res.status(500).json({ error: 'Error al marcar paquete', detalles: error.message });
    }
  }
}

module.exports = PaqueteController;
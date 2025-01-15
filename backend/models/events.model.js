import { pool } from '../database/connection.database.js';

export const EventModel = {
  create: async ({ program, description, userId }) => {
    const [result] = await pool.query(
      'INSERT INTO evento (fuente_informacion, descripcion, id_usuario) VALUES (?, ?, ?)',
      [program, description, userId]
    );
    return { id: result.insertId, program, description, userId };
  },
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM evento');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM evento WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },
  findRecentByUserId: async (userId) => {
    const [rows] = await pool.query(
      'SELECT evento.id AS evento_id, evento.fecha AS evento_fecha, evento.fuente_informacion AS evento_programa, evento.descripcion AS evento_descripcion, imagen.archivo AS imagen_archivo FROM evento LEFT JOIN imagen ON evento.id = imagen.id_evento WHERE id_usuario = ? AND evento.fecha >= NOW() - INTERVAL 48 HOUR ORDER BY evento.fecha DESC;',
      [userId]
    );
    return rows;
  },
  findRecent: async () => {
    const [rows] = await pool.query(
      `SELECT 
        evento.id AS evento_id,
        evento.fecha AS evento_fecha,
        evento.fuente_informacion AS evento_programa,
        evento.descripcion AS evento_descripcion,
        GROUP_CONCAT(imagen.archivo) AS imagenes,
        usuario.nombre AS usuario_nombre,
        usuario.apellido AS usuario_apellido,
        usuario.correo AS usuario_correo,
        usuario.cargo AS usuario_cargo
      FROM evento
      LEFT JOIN imagen ON evento.id = imagen.id_evento
      INNER JOIN usuario ON evento.id_usuario = usuario.id
      WHERE evento.fecha >= NOW() - INTERVAL 48 HOUR
      GROUP BY evento.id`
    );
    return rows;
  },
  deleteById: async (id) => {
    const [result] = await pool.query('DELETE FROM evento WHERE id = ?', [id]);
    return result;
  },
  search: async (filters) => {
    const { fechaInicio, fechaFin, orden, limite, offset } = filters;
    const query = `
      SELECT evento.id AS evento_id, evento.fecha AS evento_fecha, evento.fuente_informacion AS evento_programa, evento.descripcion AS evento_descripcion, GROUP_CONCAT(imagen.archivo) AS imagenes 
      FROM evento 
      LEFT JOIN imagen ON evento.id = imagen.id_evento 
      WHERE (? IS NULL OR evento.fecha >= ?) 
        AND (? IS NULL OR evento.fecha <= ?)
      GROUP BY evento.id 
      ORDER BY evento.${orden} DESC 
      LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(query, [
      fechaInicio, fechaInicio,
      fechaFin, fechaFin,
      limite, offset
    ]);
    return rows;
  },
  searchWithoutPage: async (filters) => {
    const { fechaInicio, fechaFin, orden, direction} = filters;
    const query = `
      SELECT 
          evento.id AS evento_id, 
          evento.fecha AS evento_fecha, 
          evento.fuente_informacion AS evento_programa, 
          evento.descripcion AS evento_descripcion, 
          GROUP_CONCAT(imagen.archivo) AS imagenes,
          usuario.nombre AS usuario_nombre,
          usuario.apellido AS usuario_apellido
       FROM evento 
       LEFT JOIN imagen ON evento.id = imagen.id_evento 
       INNER JOIN usuario ON evento.id_usuario = usuario.id
       WHERE (? IS NULL OR evento.fecha >= ?) 
         AND (? IS NULL OR evento.fecha <= ?)
       GROUP BY evento.id 
       ORDER BY evento.${orden} ${direction}`;
    const [rows] = await pool.query(query, [
      fechaInicio, fechaInicio,
      fechaFin, fechaFin
    ]);
    return rows;
  }
  ,
  countByFilters: async (filters) => {
    const { fechaInicio, fechaFin } = filters;
    const query = `
      SELECT COUNT(*) AS total 
      FROM evento 
      WHERE (? IS NULL OR fecha >= ?) 
        AND (? IS NULL OR fecha <= ?)`;
    const [total] = await pool.query(query, [fechaInicio, fechaInicio, fechaFin, fechaFin]);
    return total[0].total;
  },
  getEventById: async (eventId) => {
    const query = `
        SELECT 
          evento.id AS evento_id, 
          evento.fecha AS evento_fecha, 
          evento.fuente_informacion AS evento_programa, 
          evento.descripcion AS evento_descripcion, 
          GROUP_CONCAT(imagen.archivo) AS imagenes, 
          usuario.nombre AS usuario_nombre, 
          usuario.apellido AS usuario_apellido, 
          usuario.correo AS usuario_correo, 
          usuario.cargo AS usuario_cargo
        FROM evento 
        LEFT JOIN imagen ON evento.id = imagen.id_evento
        INNER JOIN usuario ON evento.id_usuario = usuario.id
        WHERE evento.id = ?
    `;
    const [rows] = await pool.query(query, eventId);
    return rows;
  }
};

import { pool } from '../database/connection.database.js';

export const ImageModel = {
  createMany: async (imagePaths) => {
    const query = 'INSERT INTO imagen (archivo, id_evento) VALUES ?';
    const [result] = await pool.query(query, [imagePaths]);
    return result;
  },
  findByEventId: async (eventId) => {
    const [rows] = await pool.query('SELECT * FROM imagen WHERE id_evento = ?', [eventId]);
    return rows;
  }
};
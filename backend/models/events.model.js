import { pool } from '../database/connection.database.js';

const create = async ({ program, description, user }) => {
    const query = `
      INSERT INTO evento (programa, descripcion, id_usuario)
      VALUES (?, ?, ?)
    `;
  
    try {
      console.log('se llego gente')
      const [result] = await pool.query(query, [program, description, user]);
      console.log(result)
      return { id: result.insertId };
    } catch (error) {
      console.error("Error inserting event:", error);
      throw error;
    }
  };

export const EventModel = {create};
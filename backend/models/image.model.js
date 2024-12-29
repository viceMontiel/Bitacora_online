import { pool } from '../database/connection.database.js';

const createMany = async (images) => {
  const query = `
    INSERT INTO Imagen (archivo, id_Evento)
    VALUES ?
  `;

  try {
    const [result] = await pool.query(query, [images]);
    return { affectedRows: result.affectedRows };
  } catch (error) {
    console.error('Error al insertar imágenes:', error);
    throw error;
  }
};

export const ImageModel = { createMany };

import { pool } from '../database/connection.database.js';

const create = async ({ email, password, name, last_name }) => {
  const query = `
    INSERT INTO usuario (correo, contrasena, nombre, apellido)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(query, [email, password, name, last_name]);
    // Retorna el correo y el id del usuario insertado
    return { correo: email, id: result.insertId };
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

const findOneByEmail = async (email) => {
  const query = `
    SELECT * FROM usuario
    WHERE correo = ?
  `;

  try {
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

export const UserModel = {
  create,
  findOneByEmail,
};

import { createPool } from "mysql2/promise";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../config.js";

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE
});
async function connectDB() {
  try {
    await pool.query('SELECT NOW()');
    console.log('DATABASE connected');
  } catch (error) {
    console.log(error);
  }
}

connectDB();

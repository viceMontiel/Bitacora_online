import { createPool } from "mysql2/promise";
import {
  dbConfig
} from "../config.js";

export const pool = createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  port: dbConfig.port,
  database: dbConfig.database
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

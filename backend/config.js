import { config } from "dotenv";

// Carga las variables de entorno
config();

// Verificar si faltan variables críticas
if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET no está definido en el archivo .env");
  process.exit(1); // Finaliza la ejecución si falta una variable crítica
}

// Exportar las configuraciones
export const serverConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
};

export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "bitacorasdb",
  port: process.env.DB_PORT || 3306,
};

export const securityConfig = {
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiration: process.env.TOKEN_EXPIRATION || "1h",
};

export const corsConfig = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

export const sslConfig = {
  useSSL: process.env.USE_SSL === 'true', // Convierte a booleano explícitamente
  cert: process.env.SSL_CERT || null,
  key: process.env.SSL_KEY || null,
  redirect_port: parseInt(process.env.REDIRECT_PORT, 10) || 80,
};

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import usersRoutes from './routes/users.routes.js';
import eventsRoutes from './routes/events.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { serverConfig, corsConfig } from './config.js';

const app = express();

// Configuración de CORS
app.use(cors({
  origin: corsConfig.origin, // Origen definido en config.js
}));

// Middleware para logging
if (serverConfig.nodeEnv === 'production') {
  app.use(morgan('combined')); // Log detallado en producción
} else {
  app.use(morgan('dev')); // Log simplificado en desarrollo
}

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/api/auth", usersRoutes);
app.use("/api", eventsRoutes);

// Configuración de archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Forzar HTTPS si está detrás de un proxy
app.enable('trust proxy');
app.use((req, res, next) => {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    next(); // Continuar si la solicitud es HTTPS
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`); // Redirigir a HTTPS
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;

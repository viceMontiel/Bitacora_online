import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.routes.js';
import eventsRoutes from './routes/events.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

// Configuración de CORS
app.use(cors({
  origin: `http://localhost:5173`, // Origen local en desarrollo
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/api/auth", usersRoutes);

// Rutas de eventos
app.use("/api", eventsRoutes); 

// Simular __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
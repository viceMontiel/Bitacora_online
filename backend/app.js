import express from 'express';
import cors from 'cors'; // Solo usa esta línea para importar cors
import usersRoutes from './routes/users.routes.js';

const app = express();

// Configuración de CORS
app.use(cors());  // Permitir solicitudes desde cualquier origen (deberías limitar esto en producción)

// Rutas
app.use(express.json());
app.use("/api", usersRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;

import { Router } from 'express';
import { createEvent, getEvents, getEvent, getMyLastEvents, deleteEvent } from '../controllers/events.controllers.js';
import { verifyToken } from '../middlewares/jwt.middlewares.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de Multer para manejar cargas de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../uploads'), // Carpeta de subida
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Rutas
const router = Router();

// Obtener todos los eventos
router.get('/events', verifyToken, getEvents);

// Crear un evento con imágenes
router.post('/events', verifyToken, upload.array('images', 10), createEvent);

router.get('/myevents', verifyToken, getMyLastEvents);

router.get('/events/:id', verifyToken, getEvent)

router.delete('/events/:id', verifyToken, deleteEvent)

export default router;

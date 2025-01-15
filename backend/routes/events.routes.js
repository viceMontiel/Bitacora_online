import { Router } from 'express';
import { getTurns, getEventsByTurn } from '../controllers/turns.controllers.js';
import { createEvent, getEvents, getEvent, getMyLastEvents, deleteEvent,searchEvents, downloadLast, downloadFilters} from '../controllers/events.controllers.js';
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

// Crear un evento (imagenes opcionales)
router.post('/events', verifyToken, upload.array('images', 10), createEvent);

// Obtener los ultimos eventos (ultimas 8 horas)
router.get('/myevents', verifyToken, getMyLastEvents);

// Busqueda de eventos
router.get('/events/busqueda', verifyToken, searchEvents)

// Obtener 1 evento segun id
router.get('/events/:id', getEvent)
// eliminar 1 evento segun id
router.delete('/events/:id', verifyToken, deleteEvent)
// Obtener TURNOS
router.get('/turns', getTurns)
// Obtener los eventos de los turnos
router.get('/turns/:turno', getEventsByTurn)
// Generar PDF con de los últimos eventos
router.get('/events/donwload/last', downloadLast)
// Generar PDF con los eventos filtrados en la busqueda
router.get('/events/donwload/filter', verifyToken, downloadFilters)

export default router;

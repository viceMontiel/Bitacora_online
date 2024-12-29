import { pool } from '../database/connection.database.js';
import {EventModel} from '../models/events.model.js'
import { ImageModel } from '../models/image.model.js';
import { UserModel } from '../models/users.model.js';
import path from 'path'

export const getEvents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM evento');
    res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};



export const createEvent = async (req, res) => {
  try {
    const { programa, descripcion } = req.body;

    // Validar campos requeridos
    if (!programa || !descripcion) {
      return res.status(400).json({ ok: false, msg: 'Faltan campos obligatorios' });
    }

    // Buscar usuario asociado al token
    const user = await UserModel.findOneByEmail(req.email);
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    // Crear el evento
    const newEvent = await EventModel.create({
      program: programa,
      description: descripcion,
      user: user.id,
    });

    const eventId = newEvent.id;
    console.log("Se procederá a subir archivos a bd")
    console.log(req.files)
    // Subir imágenes si existen
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => [file.path, eventId]);
      console.log(imagePaths);
      const result = await ImageModel.createMany(imagePaths);
      console.log(result, "resultado de subir imagen jejje")
      if (result.affectedRows !== req.files.length) {
        return res.status(500).json({
          ok: false,
          msg: 'No se pudieron registrar todas las imágenes',
        });
      }
    }

    // Responder al cliente
    return res.status(201).json({
      ok: true,
      msg: 'Evento creado exitosamente con imágenes incluidas',
      event: newEvent,
      success: true 
    });
  } catch (error) {
    console.error(error);

    // Detectar errores de Multer
    if (error.message.includes('file too large')) {
      return res.status(400).json({ ok: false, msg: 'Archivo demasiado grande' });
    }

    if (error.message.includes('image')) {
      return res.status(400).json({ ok: false, msg: 'Solo se permiten archivos de imagen' });
    }

    return res.status(500).json({ ok: false, msg: 'Error del servidor' });
  }
};

export const getMyLastEvents = async (req, res) => {
  try {
    // Asumimos que req.email proviene del middleware de autenticación
    const user = await UserModel.findOneByEmail(req.email); // Asegúrate de que req.email esté correctamente definido
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id = user.id; // ID del usuario autenticado

    // Consulta para obtener eventos de las últimas 8 horas
    const [rows] = await pool.query(
      'SELECT evento.id AS evento_id, evento.fecha AS evento_fecha, evento.programa AS evento_programa, evento.descripcion AS evento_descripcion, imagen.archivo AS imagen_archivo FROM evento LEFT JOIN imagen ON evento.id = imagen.id_evento WHERE id_usuario = ? AND evento.fecha >= NOW() - INTERVAL 8 HOUR ORDER BY evento.fecha DESC;',
      [id] // El ID del usuario se pasa como parámetro
    );

    // Si no se encuentran eventos, devolver una respuesta vacía
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron eventos recientes' });
    }

    // Procesar los resultados para agrupar imágenes por evento
    const eventos = rows.reduce((acc, row) => {
      const {
        evento_id,
        evento_fecha,
        evento_programa,
        evento_descripcion,
        imagen_archivo,
      } = row;
    
      // Extraer solo el nombre del archivo desde la ruta completa
      const nombreArchivo = imagen_archivo ? path.basename(imagen_archivo) : null;
    
      // Crear la URL pública para la imagen
      const imagenUrl = nombreArchivo ? `http://localhost:3000/uploads/${nombreArchivo}` : null;
    
      // Buscar si el evento ya existe en el acumulador
      const eventoExistente = acc.find((evento) => evento.id === evento_id);
      if (eventoExistente) {
        // Si el evento ya existe, añadir la imagen si existe
        if (imagenUrl) eventoExistente.imagenes.push(imagenUrl);
      } else {
        // Si el evento no existe, agregarlo al acumulador
        acc.push({
          id: evento_id,
          fecha: evento_fecha,
          programa: evento_programa,
          descripcion: evento_descripcion,
          imagenes: imagenUrl ? [imagenUrl] : [],
        });
      }
    
      return acc;
    }, []);


    // Devolver los eventos encontrados
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return res.status(500).json({ message: 'Algo salió mal al obtener los eventos' });
  }
};





export const deleteEvent = async (req, res) => {
  try {
    console.log(req.params.id)
    // Ejecuta la consulta SQL para eliminar el evento de la base de datos
    const [result] = await pool.query('DELETE FROM evento WHERE id = ?', [req.params.id]);
    console.log(result)
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Evento eliminado con éxito' });
    } else {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Algo salió mal al eliminar el evento' });
  }
}

export const getEvent = async (req, res) => {
  try{
    console.log("se estan pidiendo imagenes");
    console.log(req.params.id)
    const [result] = await pool.query('SELECT archivo FROM Imagen WHERE id_evento = ?', [req.params.id]);
    console.log(result)
    if (result.length > 0) {
       // Genera las URLs completas de las imágenes
      const imageUrls = result.map(img => `http://localhost:3000/images/${img.archivo}`);
      return res.status(200).json({ ok: true, result, images: imageUrls });

    } else {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Algo salió mal al eliminar el evento' });
  }
};
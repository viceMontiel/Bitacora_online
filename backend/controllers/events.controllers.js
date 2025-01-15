import {EventModel} from '../models/events.model.js'
import { ImageModel } from '../models/image.model.js';
import { UserModel } from '../models/users.model.js';
import path from 'path'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import moment from 'moment'

export const getEvents = async (req, res) => {
  try {
    const events = await EventModel.findAll();
    res.json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { fuente_informacion, descripcion } = req.body;

    // Validar campos requeridos
    if (!fuente_informacion || !descripcion) {
      return res.status(400).json({ ok: false, msg: 'Faltan campos obligatorios' });
    }

    // Buscar usuario asociado al token
    const user = await UserModel.findOneByEmail(req.email);
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    // Crear el evento
    const newEvent = await EventModel.create({
      program: fuente_informacion,
      description: descripcion,
      userId: user.id,
    });

    const eventId = newEvent.id;
    // Subir imágenes si existen
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => [file.path, eventId]);
      const result = await ImageModel.createMany(imagePaths);
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
    const user = await UserModel.findOneByEmail(req.email); 
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id = user.id; // ID del usuario autenticado

    // Consulta para obtener eventos de las últimas 8 horas
    const rows = await EventModel.findRecentByUserId(id);
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
          fuente_informacion: evento_programa,
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
    const result = await EventModel.deleteById([req.params.id]);
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
  try {
    console.log("Se está pidiendo el evento con imágenes y usuario asociado");
    console.log(req.params.id);

    const rows = await EventModel.getEventById([req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontró el evento" });
    }

    const row = rows[0]; // Solo habrá un evento porque se filtra por ID
    const imagenesArray = row.imagenes
      ? row.imagenes.split(",").map((imagen) => `http://localhost:3000/uploads/${path.basename(imagen)}`)
      : [];

    const evento = {
      id: row.evento_id,
      fecha: row.evento_fecha,
      fuente_informacion: row.evento_programa,
      descripcion: row.evento_descripcion,
      imagenes: imagenesArray,
      usuario: {
        nombre: row.usuario_nombre,
        apellido: row.usuario_apellido,
        correo: row.usuario_correo,
        cargo: row.usuario_cargo,
      },
    };

    console.log("Evento encontrado:", evento);
    return res.json(evento);
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    return res.status(500).json({ message: "Algo salió mal al obtener el evento" });
  }
};


export const searchEvents = async (req, res) => {
  try {
    const { c_fechaInicio, c_fechaFin, c_orden, c_pagina, c_limite } = req.query;

    const fechaInicioValida = c_fechaInicio && c_fechaInicio.trim() !== '' ? c_fechaInicio : null;
    const fechaFinValida = c_fechaFin && c_fechaFin.trim() !== '' ? c_fechaFin : null;

    let direction = "DESC";
    let ordenValido = "fecha";

    switch (c_orden) {
      case "fecha-asc":
        ordenValido = "fecha";
        direction = "ASC";
        break;
      case "fecha-desc":
        ordenValido = "fecha";
        direction = "DESC";
        break;
      case "alfabetico-asc":
        ordenValido = "fuente_informacion";
        direction = "ASC";
        break;
      case "alfabetico-desc":
        ordenValido = "fuente_informacion";
        direction = "DESC";
        break;
      default:
        ordenValido = "fecha";
        direction = "DESC";
        break;
    }

    const paginaValida = parseInt(c_pagina, 10) || 1;
    const limiteValido = parseInt(c_limite, 10) || 12;
    const offset = (paginaValida - 1) * limiteValido;

    // Llamamos a la función 'search' del modelo con los filtros
    const rows = await EventModel.search({
      fechaInicio: fechaInicioValida,
      fechaFin: fechaFinValida,
      orden: ordenValido,
      limite: limiteValido,
      offset: offset
    });

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron eventos' });
    }

    // Mapeamos los resultados para incluir las imágenes
    const eventos = rows.map((row) => {
      const imagenesArray = row.imagenes
        ? row.imagenes.split(',').map((imagen) => `http://localhost:3000/uploads/${path.basename(imagen)}`)
        : [];

      return {
        id: row.evento_id,
        fecha: row.evento_fecha,
        fuente_informacion: row.evento_programa,
        descripcion: row.evento_descripcion,
        imagenes: imagenesArray,
      };
    });

    // Llamamos a la función 'countByFilters' para obtener el total de eventos que cumplen los filtros
    const total = await EventModel.countByFilters({
      fechaInicio: fechaInicioValida,
      fechaFin: fechaFinValida,
    });

    // Enviamos la respuesta con los eventos y el total
    res.json({ eventos, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al realizar la búsqueda' });
  }
};

export const downloadLast = async (req, res) => {
  try {
    // Obtener eventos de las últimas 48 horas
    const rows = await EventModel.findRecent();

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron eventos en las últimas 48 horas" });
    }

    // Manejo correcto de rutas en Windows
    let __dirname = path.dirname(new URL(import.meta.url).pathname);
    __dirname = path.win32.normalize(__dirname).replace(/^\\/, '');

    const pdfPath = path.join(__dirname, 'ultimos_eventos.pdf');

    const outputDir = path.dirname(pdfPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Crear el PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    // Título del PDF
    doc.font('Helvetica-Bold').fontSize(20).text('Servicio Nacional de Geología y Minería de Chile', { align: 'center' }).moveDown();
    doc.font('Helvetica-Bold').fontSize(20).text('Bitácora Online Unidad de Gestión de Emergencias', { align: 'center' }).moveDown();
    doc.font('Helvetica-Bold').fontSize(14).text('Reporte de Eventos últimas 48 horas', {align: 'center'}).moveDown();
    // Agregar eventos al PDF
    rows.forEach((evento, index) => {
      // Título de cada evento
      doc.font('Helvetica-Bold').fontSize(12).text(`Evento ${index + 1}`, { underline: true }).moveDown(0.5);

      // Formatear la fecha
      const formattedDate = moment(evento.evento_fecha).format('DD/MM/YYYY, HH:mm');

      // Indicadores en negrita
      doc.font('Helvetica-Bold').fontSize(10).text(`Fecha:`).font('Helvetica').text(`${formattedDate}`).moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(10).text(`Fuente de la Información:`).font('Helvetica').text(`${evento.evento_programa}`).moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(10).text(`Descripción:`).font('Helvetica').text(`${evento.evento_descripcion}`).moveDown(0.5);
      // Información del usuario en formato "Indicador: valor"
      doc.font('Helvetica-Bold').fontSize(10).text(`Usuario Responsable:`).font('Helvetica').text(`${evento.usuario_nombre} ${evento.usuario_apellido}`).moveDown(1);

      // Imágenes
      const imageWidth = 190; // Ancho fijo para cada imagen
      const imageHeight = 190; // Altura fija para cada imagen
      const margin = 10; // Espaciado entre imágenes
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right; // Ancho útil de la página

      if (evento.imagenes) {
        const imagenes = evento.imagenes.split(',');
        let currentX = doc.page.margins.left; // Posición inicial X
        let currentY = doc.y; // Posición inicial Y
        let maxY = currentY; // Seguimiento de la posición más baja alcanzada por las imágenes
      
        imagenes.forEach((imagen, i) => {
          const imgPath = path.join(__dirname, '../uploads', path.basename(imagen));
          if (fs.existsSync(imgPath)) {
            try {
              // Verificar si hay suficiente espacio en la página para la imagen
              if (currentY + imageHeight > doc.page.height - doc.page.margins.bottom) {
                doc.addPage(); // Crear nueva página si no hay espacio vertical
                currentX = doc.page.margins.left; // Reiniciar posición X
                currentY = doc.page.margins.top; // Reiniciar posición Y
              }
      
              // Dibujar la imagen
              doc.image(imgPath, currentX, currentY, { width: imageWidth, height: imageHeight });
      
              // Actualizar posición X para la siguiente imagen
              currentX += imageWidth + margin;
      
              // Si excede el ancho disponible, pasar a la siguiente fila
              if (currentX + imageWidth > pageWidth) {
                currentX = doc.page.margins.left; // Reiniciar posición X
                currentY += imageHeight + margin; // Avanzar posición Y
              }
      
              // Actualizar el seguimiento de la posición más baja
              maxY = Math.max(maxY, currentY + imageHeight);
            } catch (err) {
              console.error(`Error al insertar la imagen ${imgPath}:`, err);
              doc.text(`Imagen ${i + 1}: No encontrada`).moveDown(0.5);
            }
          } else {
            doc.text(`Imagen ${i + 1}: No encontrada`).moveDown(0.5);
          }
        });
      
        currentY = maxY + margin;
        doc.y = currentY; // Actualizar la posición vertical para el siguiente contenido
      }
      

      doc.moveDown();
    });

    // Finalizar el PDF
    doc.end();

    // Enviar el PDF generado como respuesta
    writeStream.on('finish', () => {
      res.download(pdfPath, 'eventos_ultimas_48_horas.pdf', (err) => {
        if (err) console.error("Error al enviar el archivo:", err);
        fs.unlinkSync(pdfPath); // Eliminar el archivo después de enviarlo
      });
    });
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    return res.status(500).json({ message: "Algo salió mal al generar el PDF" });
  }
};


export const downloadFilters = async (req, res) => {
  try {
    const { c_fechaInicio, c_fechaFin, c_orden } = req.query;
    console.log(req.query);
    const fechaInicioValida = c_fechaInicio && c_fechaInicio.trim() !== '' ? c_fechaInicio : null;
    const fechaFinValida = c_fechaFin && c_fechaFin.trim() !== '' ? c_fechaFin : null;

    let direction = "DESC";
    let ordenValido = "fecha";

    switch (c_orden) {
      case "fecha-asc":
        ordenValido = "fecha";
        direction = "ASC";
        break;
      case "fecha-desc":
        ordenValido = "fecha";
        direction = "DESC";
        break;
      case "alfabetico-asc":
        ordenValido = "fuente_informacion";
        direction = "ASC";
        break;
      case "alfabetico-desc":
        ordenValido = "fuente_informacion";
        direction = "DESC";
        break;
      default:
        ordenValido = "fecha";
        direction = "DESC";
        break;
    }

    const rows = await EventModel.searchWithoutPage({
      fechaInicio: fechaInicioValida,
      fechaFin: fechaFinValida,
      orden: ordenValido,
      direction: direction
    });
    

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron eventos que coincidan con los filtros' });
    }

    let __dirname = path.dirname(new URL(import.meta.url).pathname);
    __dirname = path.win32.normalize(__dirname).replace(/^\\/, '');

    const pdfPath = path.join(__dirname, `eventos_${Date.now()}.pdf`);

    const outputDir = path.dirname(pdfPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    // Título del PDF
    doc.font('Helvetica-Bold').fontSize(20).text('Servicio Nacional de Geología y Minería de Chile', { align: 'center' }).moveDown();
    doc.font('Helvetica-Bold').fontSize(20).text('Bitácora Online Unidad de Gestión de Emergencias', { align: 'center' }).moveDown();
    doc.font('Helvetica-Bold').fontSize(14).text('Reporte de Eventos Seleccionados', {align: 'center'}).moveDown();

    rows.forEach((evento, index) => {
      doc.font('Helvetica-Bold').fontSize(12).text(`Evento ${index + 1}`, { underline: true }).moveDown(0.5);

      const formattedDate = moment(evento.evento_fecha).format('DD/MM/YYYY, HH:mm');

      doc.font('Helvetica-Bold').fontSize(10).text(`Fecha:`).font('Helvetica').text(`${formattedDate}`).moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(10).text(`Fuente de la Información:`).font('Helvetica').text(`${evento.evento_programa}`).moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(10).text(`Descripción:`).font('Helvetica').text(`${evento.evento_descripcion}`).moveDown(0.5);
      // Información del usuario en formato "Indicador: valor"
      doc.font('Helvetica-Bold').fontSize(10).text(`Usuario Responsable:`).font('Helvetica').text(`${evento.usuario_nombre} ${evento.usuario_apellido}`).moveDown(1);

      // Imágenes
      const imageWidth = 190; // Ancho fijo para cada imagen
      const imageHeight = 190; // Altura fija para cada imagen
      const margin = 10; // Espaciado entre imágenes
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right; // Ancho útil de la página

      if (evento.imagenes) {
        const imagenes = evento.imagenes.split(',');
        let currentX = doc.page.margins.left; // Posición inicial X
        let currentY = doc.y; // Posición inicial Y
        let maxY = currentY; // Seguimiento de la posición más baja alcanzada por las imágenes
      
        imagenes.forEach((imagen, i) => {
          const imgPath = path.join(__dirname, '../uploads', path.basename(imagen));
          if (fs.existsSync(imgPath)) {
            try {
              // Verificar si hay suficiente espacio en la página para la imagen
              if (currentY + imageHeight > doc.page.height - doc.page.margins.bottom) {
                doc.addPage(); // Crear nueva página si no hay espacio vertical
                currentX = doc.page.margins.left; // Reiniciar posición X
                currentY = doc.page.margins.top; // Reiniciar posición Y
              }
      
              // Dibujar la imagen
              doc.image(imgPath, currentX, currentY, { width: imageWidth, height: imageHeight });
      
              // Actualizar posición X para la siguiente imagen
              currentX += imageWidth + margin;
      
              // Si excede el ancho disponible, pasar a la siguiente fila
              if (currentX + imageWidth > pageWidth) {
                currentX = doc.page.margins.left; // Reiniciar posición X
                currentY += imageHeight + margin; // Avanzar posición Y
              }
      
              // Actualizar el seguimiento de la posición más baja
              maxY = Math.max(maxY, currentY + imageHeight);
            } catch (err) {
              console.error(`Error al insertar la imagen ${imgPath}:`, err);
              doc.text(`Imagen ${i + 1}: No encontrada`).moveDown(0.5);
            }
          } else {
            doc.text(`Imagen ${i + 1}: No encontrada`).moveDown(0.5);
          }
        });
      
        currentY = maxY + margin;
        doc.y = currentY; // Actualizar la posición vertical para el siguiente contenido
        
      }
      

      doc.moveDown();
    });
    

    doc.end();
    const fileName = `eventos_busqueda_${c_fechaInicio || 'inicio'}_a_${c_fechaFin || 'fin'}.pdf`.replace(/[:/]/g, '-');

    writeStream.on('finish', () => {
      res.download(pdfPath, fileName, (err) => {
        if (err) console.error("Error al enviar el archivo:", err);
        fs.unlinkSync(pdfPath);
      });
    });
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    return res.status(500).json({ message: 'Algo salió mal al generar el PDF' });
  }
};

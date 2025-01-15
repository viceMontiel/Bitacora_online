import { pool } from '../database/connection.database.js';
import path from 'path';

export const TurnModel = {
  getTurns: async () => {
    try {
      const [rows] = await pool.query(`
        WITH OrdenEventos AS (
            SELECT 
                E.id AS id_evento,
                E.fecha AS fecha_evento,
                U.id AS id_usuario,
                U.nombre AS nombre_usuario,
                U.apellido AS apellido_usuario,
                LAG(E.fecha) OVER (PARTITION BY E.id_Usuario ORDER BY E.fecha) AS fecha_anterior
            FROM Evento E
            JOIN Usuario U ON E.id_Usuario = U.id
        ),
        Turnos AS (
            SELECT 
                id_evento,
                fecha_evento,
                id_usuario,
                nombre_usuario,
                apellido_usuario,
                fecha_anterior,
                CASE
                    WHEN TIMESTAMPDIFF(HOUR, fecha_anterior, fecha_evento) > 8 OR fecha_anterior IS NULL THEN 1
                    ELSE 0
                END AS cambio_turno
            FROM OrdenEventos
        ),
        AgrupacionTurnos AS (
            SELECT 
                id_evento,
                fecha_evento,
                id_usuario,
                nombre_usuario,
                apellido_usuario,
                SUM(cambio_turno) OVER (PARTITION BY id_usuario ORDER BY fecha_evento) AS turno_usuario
            FROM Turnos
        ),
        TurnosGlobales AS (
            SELECT 
                id_evento,
                fecha_evento,
                id_usuario,
                nombre_usuario,
                apellido_usuario,
                turno_usuario,
                CONCAT(id_usuario, '-', turno_usuario) AS turno_global
            FROM AgrupacionTurnos
        )
        SELECT 
            turno_global AS turno,
            id_usuario,
            CONCAT(nombre_usuario, ' ', apellido_usuario) AS usuario,
            COUNT(*) AS total_eventos,
            MIN(fecha_evento) AS inicio_turno,
            MAX(fecha_evento) AS fin_turno
        FROM TurnosGlobales
        WHERE fecha_evento >= NOW() - INTERVAL 48 HOUR
        GROUP BY turno_global, id_usuario, usuario
        ORDER BY inicio_turno;
      `);
      return rows;
    } catch (error) {
      throw new Error('Error al obtener turnos');
    }
  },

  getEventsByTurn: async (turno, usuario) => {
    if (!usuario || !turno) {
      throw new Error('Parámetros faltantes: usuario o turno');
    }

    try {
      const [rows] = await pool.query(`
        WITH OrdenEventos AS (
            SELECT 
                E.id AS id_evento,
                E.fecha AS fecha_evento,
                E.id_Usuario AS id_usuario,
                LAG(E.fecha) OVER (PARTITION BY E.id_Usuario ORDER BY E.fecha) AS fecha_anterior
            FROM Evento E
        ),
        Turnos AS (
            SELECT 
                id_evento,
                fecha_evento,
                id_usuario,
                fecha_anterior,
                CASE
                    WHEN TIMESTAMPDIFF(HOUR, fecha_anterior, fecha_evento) > 8 OR fecha_anterior IS NULL THEN 1
                    ELSE 0
                END AS cambio_turno
            FROM OrdenEventos
        ),
        AgrupacionTurnos AS (
            SELECT 
                id_evento,
                fecha_evento,
                id_usuario,
                SUM(cambio_turno) OVER (PARTITION BY id_usuario ORDER BY fecha_evento) AS turno_usuario
            FROM Turnos
        ),
        TurnosGlobales AS (
            SELECT 
                id_evento,
                fecha_evento,
                id_usuario,
                turno_usuario,
                CONCAT(id_usuario, '-', turno_usuario) AS turno_global
            FROM AgrupacionTurnos
        )
        SELECT 
            E.id AS evento_id,
            E.fecha AS evento_fecha,
            E.fuente_informacion AS evento_programa,
            E.descripcion AS evento_descripcion,
            I.archivo AS imagen_archivo
        FROM TurnosGlobales TG
        JOIN Evento E ON TG.id_evento = E.id
        LEFT JOIN Imagen I ON E.id = I.id_Evento
        WHERE TG.turno_global = ? AND TG.id_usuario = ?;
      `, [turno, usuario]);

      if (rows.length === 0) {
        throw new Error('No se encontraron eventos para el turno especificado');
      }

      return rows.reduce((acc, row) => {
        const { evento_id, evento_fecha, evento_programa, evento_descripcion, imagen_archivo } = row;
        const nombreArchivo = imagen_archivo ? path.basename(imagen_archivo) : null;
        const imagenUrl = nombreArchivo ? `http://localhost:3000/uploads/${nombreArchivo}` : null;

        const eventoExistente = acc.find((evento) => evento.id === evento_id);
        if (eventoExistente) {
          if (imagenUrl) eventoExistente.imagenes.push(imagenUrl);
        } else {
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
    } catch (error) {
      throw new Error(error.message || 'Error al obtener eventos por turno');
    }
  },
};

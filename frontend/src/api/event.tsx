import axios from 'axios';
import { API_URL } from '../config/config';

const API = API_URL;

export const creation = async (formData: FormData, token: string) => {
    try {
        const response = await axios.post(
            `${API}/events`, 
            formData, // Aquí se envía directamente el objeto FormData
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Asegúrate de incluir este encabezado
                },
            }
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear evento:', error);
        throw error;
    }
};

// Función para obtener el perfil
export const fetchEvents = async (token: string) => {
    try {
      const response = await axios.get(`${API}/myevents`, {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token como Bearer
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw new Error('No se pudo obtener el evento. Por favor, verifica tu token.');
    }
  };


export const deleteEvent = async (id: number, token: string) => {
  try {
    const response = await axios.delete(
      `${API}/events/${id}`, // Agrega el ID del evento a la URL
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;  // Devuelve la respuesta de la API
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    throw new Error('No se pudo eliminar el evento. Por favor, verifica tu token.');
  }
};

interface PropsFilters {
  c_fechaInicio?: string;
  c_fechaFin?: string;
  c_orden: string;
  c_pagina: number;
  c_limite: number;
}


export const fetchFilteredEvents = async (filters: PropsFilters, token: string) => {
  try{
    const response = await axios.get(`${API}/events/busqueda`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Asegúrate de incluir este encabezado
      },
      params: filters, // Aquí se envían los filtros como parámetros de consulta
    });
    
    return response;  // Devuelve la respuesta de la API
  } catch (error){}
}

export const getEventById = async(id: string) => {
  try{
    const response = await axios.get(
      `${API}/events/${id}`,
  );
  console.log(response.data);
  return response.data;
  } 
  catch(error){}
}

export const getTurns = async() => {
  try{
    const response = await axios.get(`${API}/turns`);
    return response.data;
  }
  catch(error){}
}

export const getEventsByTurn = async(usuario: string, turno: string) => {
  try{
    const response = await axios.get(
      `${API}/turns/${turno}`, {
        params: { usuario }, // Pasa usuario como parámetro de consulta
      });
    console.log(response.data);
    return response.data;

  } 
  catch (error) {
    console.log(error)
  }
}

export const getDownloadLast = async () => {
  try {
    const response = await axios.get(`${API}/events/donwload/last`, {
      responseType: "blob", // Importante para manejar la respuesta como archivo
    });

    return response.data; // Devuelve el blob del PDF
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error; // Propaga el error para manejarlo en `DownloadLast`
  }
};
export const getDownloadFilters = async (filters: PropsFilters, token: string) => {
  try {
    const response = await axios.get(`${API}/events/donwload/filter`, {
      responseType: "blob", // Importante para manejar la respuesta como archivo
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Asegúrate de incluir este encabezado
      },
      params: filters, // Aquí se envían los filtros como parámetros de consulta
    });
    return response.data; // Devuelve el blob del PDF
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error; // Propaga el error para manejarlo en `DownloadLast`
  }
};

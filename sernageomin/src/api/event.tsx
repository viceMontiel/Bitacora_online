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
export const fetchImages = async (id: number, token: string) => {
  try {
    const response = await axios.get(
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
    console.error('Error al obtener evento:', error);
    throw new Error('No se pudo obtener el evento. Por favor, verifica tu token.');
  }
};

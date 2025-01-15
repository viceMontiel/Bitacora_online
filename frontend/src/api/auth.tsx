import axios from 'axios';
import { API_URL } from '../config/config';

const API = API_URL;

// Función para el login
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API}/auth/users/login`, { email, password });
  return response.data;
};

// Función para obtener el perfil
export const fetchUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API}/auth/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token como Bearer
      }
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    throw new Error('No se pudo obtener el perfil. Por favor, verifica tu token.');
  }
};

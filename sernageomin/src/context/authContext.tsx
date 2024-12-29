import { createContext, useContext, useState, ReactNode } from 'react';
import { fetchUserProfile } from '../api/auth';
import { creation } from '../api/event';
// Crear el contexto de autenticación
const AuthContext = createContext<any>(null);

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));

  // Función para guardar el token
  const login = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
  };

  // Función para cerrar sesión
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
  };

  // Función para obtener el perfil
  const fetchProfile = async () => {
    if (!authToken) throw new Error('No se encontró un token de autenticación.');
    return await fetchUserProfile(authToken);
  };

  const creationEvent = async (formData: FormData) => {
    if (!authToken) throw new Error('No se encontró un token de autenticación.');
    console.log("se esta enviando la data", formData)
    return await creation(formData, authToken);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, fetchProfile, creationEvent }}>
      {children}
    </AuthContext.Provider>
  );
};

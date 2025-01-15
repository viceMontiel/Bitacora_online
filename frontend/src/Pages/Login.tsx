import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom'; // Hook para redirigir

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const { authToken, login } = useAuth(); // Usar el contexto
  const navigate = useNavigate(); // Hook para navegar

  // Verificar si el usuario ya está logueado
  useEffect(() => {
    if (authToken) {
      navigate('/'); // Redirige al usuario a la página de inicio si ya está autenticado
    }
  }, [authToken, navigate]);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    setAlertMessage('');
    setAlertType('');

    if (!email || !password) {
      setAlertMessage('Todos los campos son obligatorios.');
      setAlertType('danger');
      return;
    }

    try {
      const data = await loginUser(email, password);
      login(data.token); // Guardar el token en el contexto
      setAlertMessage('Inicio de sesión exitoso.');
      setAlertType('success');
      navigate('/'); // Redirigir al usuario tras el login
    } catch (error) {
      console.error(error);
      setAlertMessage('Credenciales inválidas o error del servidor.');
      setAlertType('danger');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="p-3">Iniciar Sesión</h1>
      {alertMessage && (
        <div className={`alert alert-${alertType} mt-3`} role="alert">
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleLogin} className="mt-4 pb-3">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo Electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo electrónico institucional"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;

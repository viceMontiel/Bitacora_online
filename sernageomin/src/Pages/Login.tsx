import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleLogin = async (e:any) => {
    e.preventDefault();

    // Reset alert
    setAlertMessage('');
    setAlertType('');

    if (!email || !password) {
      setAlertMessage('Todos los campos son obligatorios.');
      setAlertType('danger');
      return;
    }

    try {
      // Enviar la solicitud a la API REST
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email,
        password,
      });

      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);

      // Mostrar mensaje de éxito
      setAlertMessage('Inicio de sesión exitoso.');
      setAlertType('success');

      // Opcional: redirigir al usuario a otra página
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      // Manejo de errores de la API
      
    }
  };

  return (
    <div className="container mt-5">
      <h1 className='p-3'>Iniciar Sesión</h1>
      {alertMessage && (
        <div className={`alert alert-${alertType} mt-3`} role="alert">
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleLogin} className="mt-4 pb-3">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo Electrónico</label>
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
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
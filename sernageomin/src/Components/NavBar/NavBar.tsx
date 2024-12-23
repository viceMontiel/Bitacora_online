import { useState, useEffect } from 'react';
import './NavBar.css';

export const NavBar = () => {
  // Estado para verificar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si el token está en localStorage cuando el componente se monta
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  const handleLogout = () => {
    // Eliminar el token de localStorage al hacer logout
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div>
      <nav className="navbar navbar-light navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="/">
            <i className="fa fa-spinner fa-spin page-loading-icon"></i>
            <img src="https://framework.digital.gob.cl/img/gob-header.svg" alt="Logo" />
          </a>
          <button
            className="navbar-toggler collapsed"
            type="button"
            data-toggle="collapse"
            data-target="#navbarDarkExampleCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse" id="navbarDarkExampleCollapse">
            <ul className="navbar-nav ml-auto">
              {isAuthenticated && (
                <>
                  <li className="nav-item priv">
                    <a className="nav-link" href="#">
                      Crear Evento
                    </a>
                  </li>
                  <li className="nav-item priv">
                    <a className="nav-link" href="#">
                      Mis últimos Eventos
                    </a>
                  </li>
                  <li className="nav-item priv">
                    <a className="nav-link" href="#">
                      Buscar Evento
                    </a>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-block btn-danger" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </>
              )}
              {!isAuthenticated && (
                <li className="nav-item" id="nopriv">
                  <a className="btn btn-block btn-primary" href="/login">
                    Iniciar sesión
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

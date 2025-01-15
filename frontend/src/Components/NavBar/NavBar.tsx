import { useAuth } from '../../context/authContext';
import './NavBar.css';

export const NavBar = () => {
  const { authToken, logout } = useAuth(); // Accede al estado de autenticación y a la función logout

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
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
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              {authToken ? (
                <>
                  <li className="nav-item priv">
                    <a className="nav-link" href="/crear-evento">
                      Crear Evento
                    </a>
                  </li>
                  <li className="nav-item priv">
                    <a className="nav-link" href="/mis-ultimos-eventos">
                      Mis últimos Eventos
                    </a>
                  </li>
                  <li className="nav-item priv">
                    <a className="nav-link" href="/buscar-eventos">
                      Buscar Evento
                    </a>
                  </li>
                  
                  <li className="nav-item">
                    <button className="btn btn-block btn-danger" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
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

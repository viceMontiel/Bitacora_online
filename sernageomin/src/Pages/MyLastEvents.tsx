import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchEvents, deleteEvent } from '../api/event';
import { Carousel } from 'react-bootstrap'; // Asume que estás usando react-bootstrap
import '../Components/CardEvent/CardEvent.css';

function MyLastEvents() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState('');
  const { authToken } = useAuth();

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const response = await fetchEvents(authToken);
        setEventos(response);
        console.log("respuesta:", response);
      } catch (error) {
        setAlertMessage('Hubo un error al obtener los eventos.');
      } finally {
        setLoading(false);
      }
    };

    obtenerEventos();
  }, [authToken]);

  const handleDelete = async (eventId: number) => {
    try {
      const response = await deleteEvent(eventId, authToken);
      if (response.status === 200) {
        setEventos(eventos.filter((evento) => evento.id !== eventId));
      }
    } catch (error) {
      setAlertMessage('Hubo un error al eliminar el evento.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="p-3">Mis Últimos Eventos</h2>

      {alertMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {alertMessage}
        </div>
      )}

      {loading ? (
        <p>Cargando eventos...</p>
      ) : (
        <div className="row m-0">
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <div key={evento.id} className="col-md-4 mb-4">
                <div className="card-news with-lead">
                  <div
                    id="imagen"
                    className="pseudo-background justify-content-center d-flex flex-row flex-wrap"
                  >
                    <Carousel interval={4000} slide={false}>
                      {(evento.imagenes || []).map((archivo: string, index: number) => (
                        <Carousel.Item key={index}>
                          <img className="h-100 w-100" src={archivo} alt={`Imagen ${index + 1}`} />

                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                  <div className="card-news-body">
                    <small>{new Date(evento.fecha).toLocaleString()}</small>
                    <p className="text-lines-7-3">{evento.descripcion}</p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-tertiary">Ver más ...</button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(evento.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-100">No hay eventos en las últimas 8 horas.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyLastEvents;

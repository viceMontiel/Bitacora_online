import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchEvents, deleteEvent } from '../api/event';
import { CardEvent } from '../Components';

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
      } catch (error) {
        setAlertMessage('Hubo un error al obtener los eventos.');
      } finally {
        setLoading(false);
      }
    };

    obtenerEventos();
  }, [authToken]);

  const handleDelete = async (eventId: number) => {
    const userConfirmed = window.confirm('¿Estás seguro que quieres eliminar el evento?');
    if (!userConfirmed) return;
  
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
      <h1 className="p-3">Mis Últimos Eventos</h1>
      <h3 className="p-3">Aquí se encuentran los eventos que haz publicado en las últimas 48 horas</h3>
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
              <CardEvent
                key={evento.id}
                id={evento.id}
                fecha={evento.fecha}
                descripcion={evento.descripcion}
                imagenes={evento.imagenes || []}
                fuente_informacion={evento.fuente_informacion}
                onDelete={handleDelete}
              />
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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './styles/img.css'
// Simulación de la función que obtiene un evento por su ID.
import { getEventById } from "../api/event";

function Event() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar el evento al montar el componente.
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(`${id}`);
        setEvent(data); // Asigna el evento recibido al estado.
      } catch (error) {
        console.error("Error al cargar el evento:", error);
      } finally {
        setLoading(false); // Detén la carga independientemente del resultado.
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  // Renderiza un mensaje de carga mientras se obtienen los datos.
  if (loading) {
    return <p>Cargando evento...</p>;
  }

  // Renderiza un mensaje si no se encuentra el evento.
  if (!event) {
    return <p>No se encontró el evento.</p>;
  }

  // Renderiza todos los atributos del evento y los datos del usuario.
  return (
    <div className="container mt-5">
      <h1 className="p-3">Evento</h1>
      <div className="event">
        <p><strong>Fecha:</strong> {new Date(event.fecha).toLocaleString()}</p>
        <p><strong>Fuente de la información:</strong> {event.fuente_informacion}</p>
        <p><strong>Descripción:</strong> {event.descripcion}</p>
        <div className="usuario">
          <h3>Evento creado por:</h3>
          <p><strong>Nombre:</strong> {event.usuario.nombre} {event.usuario.apellido}</p>
          <p><strong>Correo:</strong> {event.usuario.correo}</p>
          <p><strong>Cargo:</strong> {event.usuario.cargo}</p>
        </div>
        <p><strong>Imágenes:</strong></p>
        {event.imagenes && event.imagenes.length > 0 ? (
          <div className="imagenes p-3">
            {event.imagenes.map((img: string, index: number) => (
              <img key={index} src={img} alt={`Evento ${index + 1}`} />
            ))}
          </div>
        ) : (
          <p>Este evento no tiene imágenes.</p>
        )}
        
      </div>
    </div>
  );
}

export default Event;

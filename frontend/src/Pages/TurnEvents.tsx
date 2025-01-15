import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventsByTurn } from "../api/event";
import { CardEventNoDelete } from "../Components";

const TurnEvents = () => {
  // Extrae los parámetros de la URL
  const { usuario, turno } = useParams<{ usuario: string; turno: string }>();

  // Estado para almacenar los eventos y la carga
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Efecto para cargar los eventos al montar el componente
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (usuario && turno) {
          const response = await getEventsByTurn(usuario, turno);
          const fetchedEvents = response.eventos
          setEvents(fetchedEvents);
        }
      } catch (error) {
        console.error("Error al cargar los eventos del turno:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [usuario, turno]);

  // Renderiza un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <p>Cargando eventos...</p>;
  }

  // Renderiza un mensaje si no se encuentran eventos
  if (events.length === 0) {
    return <p>No se encontraron eventos para este turno.</p>;
  }

  // Renderiza los eventos utilizando el componente CardEventNoDelete
  return (
    <div className="container mt-5">
      <h1 className="p-3">Eventos del turno</h1>
      <div className="row m-0">
        {events.map((evento, index) => (
           <CardEventNoDelete
           key={evento.id || index} // Usa id si está definido, de lo contrario usa el índice
           id={evento.id}
           fecha={evento.fecha}
           descripcion={evento.descripcion}
           imagenes={evento.imagenes || []}
           fuente_informacion={evento.fuente_informacion}
         />
        ))}
      </div>
    </div>
  );
};

export default TurnEvents;

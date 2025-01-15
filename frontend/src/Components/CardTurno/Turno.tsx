import { useEffect, useState } from "react";
import { getTurns, getDownloadLast } from "../../api/event";
import { CardTurno } from "./CardTurno";


export const Turno = () =>  {
  const [turnos, setTurnos] = useState<any[]>([]); // Estado para los turnos.
  const [loading, setLoading] = useState(true); // Estado para manejar la carga.

  useEffect(() => {
    const fetchTurns = async () => {
      try {
        const data = await getTurns(); // Llama a la función que obtiene los turnos.
        console.log(data)
        setTurnos(data); // Asigna los turnos al estado.
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
      } finally {
        setLoading(false); // Finaliza el estado de carga.
      }
    };

    fetchTurns();
  }, []);

  const DownloadLast = async () => {
    try {
      const pdfBlob = await getDownloadLast(); // Llama a la función de API
  
      // Crear un enlace temporal para descargar
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "eventos_ultimas_48_horas.pdf"); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
  
      // Limpiar después de descargar
      if (link.parentNode) {
        link.parentNode.removeChild(link); // Verifica si `parentNode` no es null antes de eliminar
      }
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };
  

  if (loading) {
    return <p>Cargando turnos...</p>;
  }

  if (turnos.length === 0) {
    return <p>No se encontraron turnos recientes.</p>;
  }

  return (
    <div className="turnos-container">
      <div className="d-flex justify-content-between align-items-center pb-2">
          <p></p>
          <button 
              onClick={DownloadLast} 
              className="btn btn-primary "
            >
              Descargar reporte PDF
          </button>
          
      </div>
      
      <div className="row m-0">
        {turnos.map((turno, index) => (
          <CardTurno key={index} turno={turno} />
        ))}
      </div>
    </div>
  );
}


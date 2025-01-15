import { useState, useEffect } from 'react';
import { CardEventNoDelete } from '../Components';
import { useAuth } from '../context/authContext';
import { fetchFilteredEvents, getDownloadFilters } from '../api/event';
import './styles/filters.css';

interface Filters {
  c_fechaInicio?: string;
  c_fechaFin?: string;
  c_orden: string;
  c_pagina: number;
  c_limite: number;
}

function SearchEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authToken } = useAuth();

  // Filtros y paginación
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [orden, setOrden] = useState('fecha-desc');
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(12); // Número de eventos por página
  const [totalPaginas, setTotalPaginas] = useState(1);

  const sumarUnDia = (fecha: string) => {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 19);
  };

  const buscarEventos = async () => {
    setLoading(true);
    setError('');

    try {
      const filters: Filters = {
        c_fechaInicio: fechaInicio || undefined,
        c_fechaFin: fechaFin ? sumarUnDia(fechaFin) : undefined,
        c_orden: orden,
        c_pagina: pagina,
        c_limite: limite,
      };

      const response = await fetchFilteredEvents(filters, authToken);
      console.log(response);
      const eventos = response?.data?.eventos || [];
      const paginas = Math.ceil((response?.data?.total || 1) / limite);

      setEvents(eventos);
      setTotalPaginas(paginas);
    } catch (err) {
      setError('Error al buscar eventos.');
    } finally {
      setLoading(false);
    }
  };

  const getDownloadFilter = async () => {
    const filters: Filters = {
      c_fechaInicio: fechaInicio || undefined,
      c_fechaFin: fechaFin ? sumarUnDia(fechaFin) : undefined,
      c_orden: orden,
      c_pagina: pagina,
      c_limite: limite,
    };

    try {
      // Aquí llamas a la API para generar y descargar el documento
      console.log('Llamando a la API con filtros:', filters);
      const pdfBlobs = await getDownloadFilters(filters, authToken);

       // Crear un enlace temporal para descargar
       const url = window.URL.createObjectURL(pdfBlobs);
       const link = document.createElement("a");
       link.href = url;
       link.setAttribute("download", "eventos_busqueda.pdf"); // Nombre del archivo
       document.body.appendChild(link);
       link.click();
   
       // Limpiar después de descargar
       if (link.parentNode) {
         link.parentNode.removeChild(link); // Verifica si `parentNode` no es null antes de eliminar
       }
       window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error al generar y descargar el documento:', err);
    }
  };

  useEffect(() => {
    buscarEventos();
  }, [pagina, orden]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPaginas) {
      setPagina(newPage);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="p-3">Buscar Eventos</h1>
      
      <div className="d-flex justify-content-between align-items-center ">
        <div className='filtros-container-compacto mb-4'>
          <div className="filtro-item">
            <label htmlFor="fechaInicio">Desde:</label>
            <input
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="filtro-item">
            <label htmlFor="fechaFin">Hasta:</label>
            <input
              type="date"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <div className="filtro-item">
            <label htmlFor="orden">Ordenar:</label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="fecha-asc">Fecha Ascendente</option>
              <option value="fecha-desc">Fecha Descendente</option>
              <option value="alfabetico-asc">Alfabético Ascendente</option>
              <option value="alfabetico-desc">Alfabético Descendente</option>
            </select>
          </div>
            <button
            className="btn btn-aplicar"
            onClick={() => {
              setPagina(1);
              buscarEventos();
            }}
          >
            Aplicar
          </button>
        </div>
        <button
          className="btn btn-primary"
          onClick={getDownloadFilter}
        >
          Descargar Eventos Buscados
        </button>
      </div>

      

      {loading && <p>Cargando eventos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

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

      <nav className="pagination-container mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(pagina - 1)}>{'<'}</button>
          </li>

          {[...Array(totalPaginas).keys()].slice(0, 5).map((num) => (
            <li key={num} className={`page-item ${pagina === num + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(num + 1)}>
                {num + 1}
              </button>
            </li>
          ))}

          {totalPaginas > 5 && (
            <li className="page-item disabled">
              <div className="page-link">...</div>
            </li>
          )}

          {totalPaginas > 5 && (
            <li className="page-item">
              <button className="page-link" onClick={() => handlePageChange(totalPaginas)}>
                {totalPaginas}
              </button>
            </li>
          )}

          <li className={`page-item ${pagina === totalPaginas ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(pagina + 1)}>{'>'}</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SearchEvents;

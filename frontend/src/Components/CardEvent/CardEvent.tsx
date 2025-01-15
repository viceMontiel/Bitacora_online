import { ImgCarusel } from '../ImgCarousel/ImgCarusel';
import './CardEvent.css'
import { Link } from 'react-router-dom';

interface CardEventProps {
  id: number;
  fecha: string;
  descripcion: string;
  imagenes: string[];
  fuente_informacion: string;
  onDelete: (id: number) => void;
}

export  const CardEvent = ({ id, fecha, descripcion, imagenes, fuente_informacion, onDelete }: CardEventProps) => {
  
  const hasImages = imagenes.length > 0;

  return (
    <div className="col-md-4 mb-4">
      <div className="card-news with-lead">
      <div
          id="imagen"
          className={`pseudo-background justify-content-center d-flex flex-row flex-wrap ${
            hasImages ? 'with-images' : 'no-images'
          }`}
        >
          {hasImages ? (
            <ImgCarusel images={imagenes} />
          ) : (
            <p className="no-images-text">Sin imágenes disponibles</p>
          )}
        </div>
        <div className="card-news-body">
        <p className='fecha'>{new Date(fecha).toLocaleString()}</p>
        <p className='program'>{fuente_informacion}</p>
          <p className="text-lines-7-3">{descripcion}</p>
          <div className="d-flex justify-content-between">
            <Link to={`/${id}`}>
               <button className="btn btn-tertiary">Ver más ...</button>
            </Link>
            <button className="btn btn-danger" onClick={() => onDelete(id)}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


import { Link } from "react-router-dom";

interface CardTurnoProps {
  turno: {
    id_usuario: string;
    usuario: string;
    inicio_turno: string;
    fin_turno: string;
    turno: string;
  };
}

export const CardTurno = ({ turno }: CardTurnoProps) => {
  return (
    <div className="col-md-4">
      <div className="card-news">
        <div className="card-news-body-with-image-bg pseudo-background">
          <h3 className="text-lines-3-0.2">{turno.usuario}</h3>
          <div className="card-news-body">
            <p><strong> Inicio del turno: </strong>{new Date(turno.inicio_turno).toLocaleString()}</p>
            <p><strong>Fin del turno: </strong>{new Date(turno.fin_turno).toLocaleString()}</p>
            <div className="card-news-footer text-center">
              <Link to={`/${turno.id_usuario}/${turno.turno}`}>
                <button className="btn btn-outline-primary">Ver Eventos</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

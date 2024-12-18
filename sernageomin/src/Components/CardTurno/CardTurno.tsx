import { Link } from "react-router-dom"
export const CardTurno = () => {
  return (
    
        <div className="col-md-4 ">
            <div className="card-news">
                <div className="card-news-body-with-image-bg pseudo-background">
                    <h3 className="text-lines-3-0.2">Vicente Montiel Torres</h3>
                    <div className="card-news-body">
                        <small>13 de Julio de 2018</small>
                        <p>Primer Evento Publicado</p>
                        <p>Último Evento Publicado</p>
                        <div className="card-news-footer text-center">
                            <Link to="/eventos">
                                <button className="btn btn-outline-primary" >Ver Eventos</button>
                            </Link>
                                
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
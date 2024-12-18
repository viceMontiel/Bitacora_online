import { Link } from "react-router-dom"
import './CardEvent.css'
import Min from '../../assets/color_MinMineria.png'
import { Carousel } from "react-bootstrap"
export const CardEvent = () => {
  return (
    <div className="col-md-4">
        <div className="card-news with-lead">
            <div id="imagen" className="pseudo-background justify-content-center d-flex flex-row flex-wrap">
                <div id="indicator" className="h-100 carousel slide" data-bs-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-bs-target="#indicator" data-bs-slide-to="0" className="active"></li>
                        <li data-bs-target="#indicator" data-bs-slide-to="1"></li>
                        <li data-bs-target="#indicator" data-bs-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner h-100">
                        <div className="h-100 carousel-item active">
                            <img className="w-100 h-100 object-fit-scale" src={Min} alt="Imagen 1"/>
                        </div>
                        <div className="carousel-item">
                            <img className="w-100 h-100 object-fit-scale" src="https://ralfvanveen.com/wp-content/uploads/2023/03/google-updates-768x496.jpg" alt="Imagen 2"/>
                        </div>
                        <div className="carousel-item">
                            <img className="w-100 h-100 object-fit-scale" src="https://www.sernageomin.cl/wp-content/uploads/2023/04/Banner-Tienda-Digital-SNGM.png" alt="Imagen 3"/>
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#indicator" role="button" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#indicator" role="button" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </a>
                </div>
            </div>
            <div className="card-news-body">
                <small>13 de Julio de 2018</small>
                <p className="text-lines-7-3">
                    El presidente inauguró las Fondas del
                    Parque O’Higgins e inició las celebraciones del 18 de septiembre con un pie de cueca y
                    un brindis junto al Alcalde de Santiago, y autoridades.
                </p>
                <p>...</p>
                <Link to="#">
                    <button className="btn btn-tertiary"> Ver más ...</button>
                </Link>
            </div>
        </div>
    </div>
  )
}


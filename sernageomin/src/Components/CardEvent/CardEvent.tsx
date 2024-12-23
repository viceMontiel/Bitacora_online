import { Link } from "react-router-dom"
import './CardEvent.css'
import Min from '../../assets/color_MinMineria.png'
import { Carousel } from "react-bootstrap"
export const CardEvent = () => {
  return (
    <div className="col-md-4">
        <div className="card-news with-lead">
            <div id="imagen" className="pseudo-background justify-content-center d-flex flex-row flex-wrap">
                <Carousel interval={4000} slide={false}>
                    <Carousel.Item >
                        <img 
                        
                            className="h-100"
                            src={Min} 
                            alt="Imagen 1" 
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img 
                        
                        className="h-100" 
                            src="https://ralfvanveen.com/wp-content/uploads/2023/03/google-updates-768x496.jpg" 
                            alt="Imagen 2" 
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img 
                        
                        className="h-100" 
                            src="https://www.sernageomin.cl/wp-content/uploads/2023/04/Banner-Tienda-Digital-SNGM.png" 
                            alt="Imagen 3" 
                        />
                    </Carousel.Item>
                </Carousel>
            </div>

            <div className="card-news-body">
                <small>13 de Julio de 2018</small>
                <p className="text-lines-7-3">
                    El presidente inauguró las Fondas del
                    Parque O’Higgins e inició las celebraciones del 18 de septiembre con un pie de cueca y
                    un brindis junto al Alcalde de Santiago, y autoridades.
                </p>
                <p>...</p>
                <Link to="/eventos/eventoX">
                    <button className="btn btn-tertiary"> Ver más ...</button>
                </Link>
            </div>
        </div>
    </div>
  )
}


import { ImgCarousel } from "../Components"

function Event() {
  return (
    <div>
        <h1 className="p-3">Evento</h1>
        <div className="event">
            <div className="image p-3">
                <ImgCarousel></ImgCarousel>
            </div>
            <div className="content"></div>
        </div>
    </div>
  )
}

export default Event
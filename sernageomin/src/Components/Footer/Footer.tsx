import min from '../../assets/color_MinMineria.png'
export const Footer = () => {
  return (
    <div className="container">
      <div className="line"></div>
      <div className="row">
        <div className="col-md-3 a11y-fonts-col-12">
          <img className="mw-100 mb-3" src={min}/>
          <a className="py-0" href="https://www.sernageomin.cl" target='blank_'>www.sernageomin.cl</a>
        </div>
        <div className="col-md-5 a11y-fonts-col-12 ">
          <p>Unidad de Gestión de Emergencias</p>
          <p>2024 | Servicio Nacional de Geología y Minería </p>
          <p>Av. Santa María 0104 - Providencia - Chile</p>
          </div>
        <div className="col-md-3 a11y-fonts-col-12">
          <div className="text-uppercase mb-3">Contacto</div>
          <p className="py-0">
            sernageomin@sernageomin.cl
          </p><a className="py-0" >+56 2 2482 5500</a>
        </div>
      </div>
    </div>

  )
}

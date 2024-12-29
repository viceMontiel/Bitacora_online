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
          <p>2024 | Servicio Nacional de Geología y Minería </p>
          <p className="py-0">
            sernageomin@sernageomin.cl
          </p>
          <a className="py-0" >+56 2 2482 5500</a>
          <p>Av. Santa María 0104 - Providencia - Chile</p>
        </div>
        <div className="col-md-3 a11y-fonts-col-12">
          <p className='py-0'>Unidad de Gestión de Emergencias</p>
          
          <p>Contacto Emergencias 24 x 7: <a  className='py-0'>+56 9 7360 7904 </a> </p>
          <p>emergencias@sernageomin.cl</p>

        </div>
      </div>
    </div>

  )
}

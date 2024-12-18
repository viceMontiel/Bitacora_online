import min from '../../assets/color_MinMineria.png'
export const NavBar =()  =>{
  return (
    <div>
      <nav className="navbar navbar-light navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand mr-auto" href="/">
            <i className="fa fa-spinner fa-spin page-loading-icon"></i>
            <img src={min}/> 
          </a>
          
          <div className="navbar-collapse collapse" id="navbarDarkExampleCollapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><a className="btn btn-block btn-primary" href="/login">Iniciar sesión</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

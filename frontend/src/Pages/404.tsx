import { Link } from "react-router-dom";

function Page404() {
  return (
    <div>
        <h1 className="p-3">Página no econtrada</h1>
        <Link to="/" className="d-flex flex-grid justify-content-center pb-3">
          <button className="btn btn-accent btn-default-size" type="button">
            Regresar a Inicio
          </button>
        </Link>
    </div>
  )
}

export default Page404;
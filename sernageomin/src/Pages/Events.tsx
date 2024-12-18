import {CardEvent} from '../Components'

function Events() {
  return (
    <div>
        <h1 className="p-3">Eventos del Turno</h1>
        <p className="ml-3 p-1">Analista: Vicente Montiel Torres</p>
        <div className="row  m-0">
          <CardEvent></CardEvent>
          <CardEvent></CardEvent>
          <CardEvent></CardEvent>
          <CardEvent></CardEvent>
        </div>
    </div>
  )
}

export default Events
import {CardTurno} from '../Components'
function Home() {
  return (
    <div>
        <div className='mt-2'></div>
        <h1 className='p-3'>Turnos de Hoy</h1>
        <div className="row  m-0">
          <CardTurno></CardTurno>
          <CardTurno></CardTurno>
          <CardTurno></CardTurno>
        </div>
        
        
    </div>
  )
}

export default Home
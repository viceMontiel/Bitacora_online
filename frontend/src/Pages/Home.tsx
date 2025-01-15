import { Turno } from '../Components/CardTurno/Turno';

const Home = () => {
  

  return (
    <div>
      <div className="mt-2"> <h1 className='p-3'>Bienvenido a la Bitácora Online de la Unidad de Gestión de Emergencias</h1></div>
     
      <h2 className="p-3">Turnos Registrados en las últimas 48 horas</h2>
      
      <div className="p-3">
        <Turno></Turno>
        <section>
          <br />
          <small>Para encontrar más turnos y eventos, comunícate a la Unidad de Gestión de Emergencias del Sernageomin</small>
        </section>
      </div>
    </div>
  );
};

export default Home;

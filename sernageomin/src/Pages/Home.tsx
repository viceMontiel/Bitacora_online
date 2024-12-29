
import { CardTurno } from '../Components';

const Home = () => {
  

  return (
    <div>
      <div className="mt-2"></div>
      <h1 className="p-3">Últimos Turnos</h1>
      
      <div className="row m-0">
        <CardTurno></CardTurno>
        <CardTurno></CardTurno>
        <CardTurno></CardTurno>
      </div>
    </div>
  );
};

export default Home;

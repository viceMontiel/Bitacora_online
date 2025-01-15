import { BrowserRouter, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import InvalidRoutes from "./InvalidRoutes";
import Events from "../Pages/TurnEvents";
import Event from "../Pages/Event";
import ProtectedRoutes from "./ProtectedRoutes";
import Profile from "../Pages/Profile";
import CreateEvent from "../Pages/CreateEvent";
import MyLastEvents from "../Pages/MyLastEvents";
import SearchEvents from "../Pages/SearchEvent";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <InvalidRoutes>
            {/* Ruta pública */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/:usuario/:turno" element={<Events />} />
            <Route path="/:id" element={<Event />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoutes />}>
                <Route path="/perfil" element={<Profile/>} />
                <Route path="/crear-evento" element={<CreateEvent/>}></Route>
                <Route path="/mis-ultimos-eventos" element={<MyLastEvents/>}/>
                <Route path='/buscar-eventos' element={<SearchEvents/>}></Route>
            </Route>
            

          
      </InvalidRoutes>
    </BrowserRouter>
  );
};

export default AppRouter;

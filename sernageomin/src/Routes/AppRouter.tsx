import { BrowserRouter,  Route } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import InvalidRoutes from "./InvalidRoutes";
import Events from "../Pages/Events";

const AppRouter = () => {
    return(
        <BrowserRouter>
            <InvalidRoutes>
                <Route path="/" element={ <Home /> }/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/eventos" element={<Events/>}/>
            </InvalidRoutes>
        </BrowserRouter>
    );
}
export default AppRouter;
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext"

function ProtectedRoutes() {
    const {authToken} = useAuth();

    if (!authToken) return <Navigate to='/login' replace/>

    return <Outlet/>
}

export default ProtectedRoutes
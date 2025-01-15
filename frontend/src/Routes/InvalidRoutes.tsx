import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Page404 from "../Pages/404";

interface Props{
    children: ReactNode
}

function InvalidRoutes({children}: Props) {
  return (
    <Routes>
        {children}
        <Route path="*" element={<Navigate to="/404"/>}/>
        <Route path="/404" element={ <Page404 /> } />
    </Routes>
  )
}

export default InvalidRoutes;
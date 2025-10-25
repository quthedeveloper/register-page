import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AccessContext } from "./accessContext";

export default function Protectmain(){
const access = localStorage.getItem('email');

if(!access){
    return <Navigate to = '/'/>
}
else{
    return <Outlet/>
}
}


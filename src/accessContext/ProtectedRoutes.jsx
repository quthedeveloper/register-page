import { Navigate } from "react-router-dom";



export function ProtectedRoute({ children }){  
const token = localStorage.getItem('email');
if(!token){
return <Navigate to = '/'/>    
}
else
    return children;
}
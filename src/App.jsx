import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from "./register-page";
import Login from "./login-page";
import Otp from './otp';
import { AccessContext} from './accessContext/accessContext';
import  TokenContext from './accessContext/tokenContext';
import React, {useState} from 'react';
import { ProtectedRoute } from './accessContext/ProtectedRoutes';
import Dashboard from './main-page/dashboard';
import Protectmain from './accessContext/ProtectMain';
import {ExpensePage} from '../src/main-page/expense';
import { IncomePage } from './main-page/income';



function App(){
  const [token, setaccessToken] = useState('');
    function settertoken(token){
        setaccessToken(token)
    }
    const [Cemail, accessEmail] = useState(null);
    const [accesstoken, setAccess] = useState(null);
  return(<>
  <AccessContext.Provider value={{Cemail, accessEmail}}>
   <TokenContext.Provider value={{accesstoken,setAccess}}> 
  <BrowserRouter>
  <Routes>
      <Route path='/register' element ={<Register />}/>
      <Route path = '/' element={<Login settertoken = {settertoken}/>}/>
      <Route path='/otp' element = {
        <ProtectedRoute>
        <Otp/>
        </ProtectedRoute>
      }
      ></Route>
      <Route element={<Protectmain/>}>
        <Route path='/dashboard'  element ={<Dashboard token={token}/>}/>
        <Route path='/expensepage' element = {<ExpensePage/>}/>
        <Route path='/incomepage' element = {<IncomePage/>}/>
      </Route>
  </Routes>
  </BrowserRouter>
  </TokenContext.Provider>
  </AccessContext.Provider>
  </>)

}

export default App
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './log.css';
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import  TokenContext  from './accessContext/tokenContext';


function Login({ settertoken }){
const {accessToken, setAccess} = useContext(TokenContext);
 const navigate = useNavigate();
const [loginData, setLoginData] = useState({
    email: "",
    password: ""
});



const handleChange = (event) => {
setLoginData({
    ...loginData,
    [event.target.name]: event.target.value
})
}

const handleSubmit = (event) =>{
event.preventDefault();
axios.post('https://login-backend-izl3.onrender.com/login/log', loginData, {
    withCredentials: true
})
.then(res => {
  if(res.status === 200){
    localStorage.setItem('email', res.data.email);
    const key = res.data.accessToken;
    setAccess(key);
    settertoken(key);
    navigate('/dashboard');
  }
}).catch(err => {
    if(err.response.status === 401){
       alert('User does not exist, Click on register to register address');
    }
    if(err.response.status === 404){
        alert('User entered wrong password');
    }
  
})
}


    return(<>
    <div className="login-container">
        
        <div className="background-decoration">
            <div className="decoration-orb decoration-orb-1"></div>
            <div className="decoration-orb decoration-orb-2"></div>
        </div>
        
      
        <div className="login-card">
            <div className="card-header">
                <div className="logo-container">
                    <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <h1 className="card-title">Welcome back</h1>
                <p className="card-description">Sign in to your account to continue</p>
            </div>
            <div className="card-content">
                <form className="login-form"  onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            id="email"
                            type="email"
                            name='email'
                            placeholder="Enter your email"
                            className="form-input"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            name='password'
                            placeholder="Enter your password"
                            className="form-input"
                            required
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-options">
                        <div className="checkbox-group">
                            <input type="checkbox" id="remember" className="checkbox"/>
                            <label htmlFor="remember" className="checkbox-label">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" className="submit-button">Sign in</button>
                </form>
                <div className="signup-section">
                    <p className="signup-text">
                        Don't have an account? 
                        <NavLink  className="signup-link" to='/register'>Register</NavLink>
                    </p>
                </div>
            </div>
        </div>
    </div>

    
    </>)
}

export default Login
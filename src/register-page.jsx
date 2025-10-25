import './regis.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AccessContext } from './accessContext/accessContext';
import  { Spinner } from './UI extras/Spinner'

// work on JWT verify
function Register(){
const navigate = useNavigate();
const { email, accessEmail} = useContext(AccessContext);
const [FormData, setData] = useState(
    {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    }
)
const [status, setStatus] = useState(0);
const [load, setload] = useState(false);
const [Localemail, setEmail] = useState('')






useEffect(()=>{
    if(location.state?.regMessage){
        alert(location.state.regMessage);
    }
},[location.state]);


const handleChange = (event) => {
setData({
    ...FormData,
    [event.target.name]: event.target.value
})
}

const handleFormData = (event) => {
event.preventDefault();
setload(true);
const cont = Object.values(FormData).some(value => value === "")
if(cont){
    alert('Fill all fields');
} 
else{
axios.post('https://login-backend-izl3.onrender.com/reg/register',FormData)
.then(async (res) => {      
   if(res?.status === 201){
    localStorage.setItem('email', res.data?.email);
         await axios.get(`https://login-backend-izl3.onrender.com/otp/sendotp?email=${FormData.email}`);
         navigate('/otp');
        setload(false);
}
   
})
.catch(err => {
    if(err.response.status === 409){
        alert('User already exists enter new Credentials');
        navigate('/');
    }
    else if(err.response.status === 400){
        alert('passwords dont match');
    }
    setload(false);
})
}
}

return(<>

 <div className="form-card">
        <header className="form-header">
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Join us today and start your journey</p>
        </header>
        
        <form className="registration-form" onSubmit={handleFormData}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="firstName" className="names">First Name</label>
                    <input type="text" id="firstName" name="firstName" className="form-input" placeholder="John" required onChange={handleChange}/>
                </div>
                
                <div className="form-group">
                    <label htmlFor="lastName" className="names">Last Name</label>
                    <input type="text" id="lastName" name="lastName" className="form-input" placeholder="Doe" required onChange={handleChange}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email" className="names">Email Address</label>
                <input type="email" id="email" name="email" className="form-input" placeholder="john@example.com" required onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label htmlFor="password" className="names">Password</label>
                <input type="password" id="password" name="password" className="form-input" placeholder="Enter password" required onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword" className="names">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" className="form-input" placeholder="Confirm password" required onChange={handleChange}/>
            </div>
            <button className='submit-button'>{load === false ? 'Submit' : <Spinner/>}</button>
        </form>

        <footer className="form-footer">
            <p className="login-link">
                Already have an account? 
                <NavLink to='/' className="link">Sign in</NavLink>
            </p>
        </footer>
    </div>
</>)
}

export default Register
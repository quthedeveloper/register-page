import './otp.css';
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Vspinner } from './UI extras/verifySpinner';
import  TokenContext  from './accessContext/tokenContext';


function Otp(){
const {accesstoken, setAccess} = useContext(TokenContext);
const navigate = useNavigate();
const Location = useLocation();
const [show, setShow] = useState(true);
let [time, setTime] = useState(JSON.parse(sessionStorage.getItem('time')) || 0);
const [otpNum, setOtp] = useState([]);
const [localemail, setEmail] = useState('');
const [spin, setSpin] = useState(false);

useEffect(()=>{
const email = localStorage.getItem('email');
setEmail(email);
alert("Check your spam if you dont see on refresh");
}, [])



const addTime = () => {
    setTime(60);
    axios.get(`https://login-backend-izl3.onrender.com/otp/sendotp?email=${localemail}`).then(res => {
        if(res.status === 200){
            console.log('OTP has been sent');
            setShow(false);
        }
    })
}
useEffect(()=>{
     let interval;
    if(time <= 60 && time >= 1){
     interval = setInterval(()=>{
        setTime(t => {
            if(t >= 0){
                const newTime = t - 1;
                sessionStorage.setItem('time', JSON.stringify(newTime))
                return newTime;
            }
        })
        
    },1000)
}

    const num = JSON.parse(sessionStorage.getItem('time'))
    if(num > 0 && num <= 60){
        setShow(false)
    }else{
        setShow(true)
    }    
      return () => {
            clearInterval(interval);
        } 
},[time])




const appendOTP = (event) => {
 const index = Number(event.target.getAttribute("data-index"));
setOtp(o => {
 const copy = [...o];
 copy[index] = event.target.value;
 return copy;
});
}

const sendOTP = (e) => {
    e.preventDefault();
    if (otpNum.length !== 6){
        alert("figures in otp must be six");
        
    }else{
        //axios post for otp for verification
        axios.post('https://login-backend-izl3.onrender.com/key/verify', {
            otp: otpNum.join(''),
            email: localemail
        },{ withCredentials: true }).then(res => {
            if(res.status === 200){   
               setAccess(res.data?.accessToken);
                 navigate('/dashboard');
            }
         
        }).catch(err =>{
             if(err.response.status === 404){
        alert('verification gone wrong, check or request for a new one');
    }
    else if(err.response.status === 500){
        alert('server problem try again later');
    }
        })
    }
}

const back = () => {
    navigate('/register')
}

return(
    <>
    <div className="otp-container">
        <div className="background-decoration">
            <div className="decoration-orb decoration-orb-1"></div>
            <div className="decoration-orb decoration-orb-2"></div>
        </div>

        
        <div className="otp-card">
            <div className="card-header">
                <div className="logo-container">
                    <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                </div>
                <h1 className="card-title">Verify Your Account</h1>
                <p className="card-description">Enter the 6-digit code sent to your email</p>
            </div>

            
            <div className="card-content">
                <form className="otp-form" id="otpForm">
                   
                    <div className="otp-input-container">
                        <input type="text" className="otp-input" maxLength="1" data-index="0" onChange={appendOTP}/>
                        <input type="text" className="otp-input" maxLength="1" data-index="1" onChange={appendOTP}/>
                        <input type="text" className="otp-input" maxLength="1" data-index="2" onChange={appendOTP}/>
                        <input type="text" className="otp-input" maxLength="1" data-index="3" onChange={appendOTP}/>
                        <input type="text" className="otp-input" maxLength="1" data-index="4" onChange={appendOTP}/>
                        <input type="text" className="otp-input" maxLength="1" data-index="5" onChange={appendOTP}/>
                    </div>

                    
                    <button type="submit" className="submit-button" onClick={sendOTP}>{spin === false ? 'Verify Code' : <Vspinner/>}</button>
                </form>

                
                <div className="resend-section">
                    <p className="resend-text">Didn't receive the code?</p>
                    {show && <button className="resend-link" id="resendBtn" onClick={addTime}>Resend Code</button>}
                    {time === 60 || time <= 60 && time >= 1 ? <div className="timer-text" id="timer">Resend in <span id="countdown">{time}</span>s</div> : null}
                </div>

                
                <div className="back-section">
                    <Link to="/register"className="back-link" onClick={back}>← Back to Register</Link>
                </div>
            </div>
        </div>
    </div>

    
    </>
)
}

export default Otp
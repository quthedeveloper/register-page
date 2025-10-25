import  TokenContext  from "../accessContext/tokenContext";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './dashboard.css';
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import { Doughnut } from "react-chartjs-2";


ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend
);

function Dashboard(){
const navigate = useNavigate();
const Location = useLocation();
const {accesstoken, setAccess} = useContext(TokenContext);
const [skeletonEnabler, setEnabler] = useState(false);
const [email, setEmail] = useState('');
const [info, setinfo] = useState({});
const [balance, setbalance] = useState(0);
const [income, setIncome] = useState(0);
const [expense, setExpense] = useState(0);
const[recentIncome, setrecentIncome] = useState([]);
const[recentExpense, setrecentExpense] = useState([]);
const [healthcare, sethealthcare] = useState(0);
const [Entertainment, setentertainment] = useState(0);
const [shopping, setshopping] = useState(0);
const [food, setfood] = useState(0);
const [others, setothers] = useState(0);
const [transport, settransport] = useState(0);
const [utils, setutils] = useState(0);
const [side, setShowSide] = useState(false);

const data = {
    labels: ['balance', 'expense', 'income'],
    datasets:[{
        label: 'amount',
        data: [balance, expense, income],
        backgroundColor: ["#f39c12","#ef3333ff","#27ae60"],
        borderColor: ["#f39c12","#ef3333ff","#27ae60"]
    }]
};
const options ={
    plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        pointStyle: 'circle' ,
         boxWidth: 40
      }
    }
  }
};
  

useEffect(()=>{
   const API = axios.create({
    withCredentials: true,
    baseURL: 'https://login-backend-izl3.onrender.com'
   });

   // request interceptor
   API.interceptors.request.use(function (config){
    setEnabler(true);
    return config
   }, (err)=> {
    setEnabler(false);
    return Promise.reject(err);
   }
)

API.interceptors.response.use(function (response){
    if(response.data?.email){
        setEmail(response.data.email);   
    }
    if(response.data?.accessToken){
        setAccess(response.data.accessToken);
    }
       
    
    return response;
}), (error) => {
    setEnabler(false);
    if(error.response.status === 400){
        alert('you do not exist')// message div
    }
    else if(error.response.status === 401){
        localStorage.removeItem('email');
        navigate('/');
    }
    else if(error.response.status === 500){
        alert('server error please');//message div
        navigate('/');
    }
}

API.get('/refresh/jwt', { withCredentials: true });

}, [])

const getInfo = async() =>{
    try{
        const res = await axios.get("https://login-backend-izl3.onrender.com/dashboard/info",
        {
            headers:{
                Authorization:`<Bearer> ${accesstoken}`
            }
        }
    )

    if(res.status === 200){
        setinfo(res.data?.dashboard);
    }
    }catch(err){
    if(err.response?.status === 401){
     let newToken
     const res = await axios.get('https://login-backend-izl3.onrender.com/refresh/jwt',
        {
            withCredentials: true
        }
    );
    if(res){
         newToken = res.data?.accessToken;
        setAccess(res.data?.accessToken);
    }
      err.config.headers.Authorization = `<Bearer> ${newToken}`
      const refrshReq = await axios(err.config);        
      if (refrshReq.status === 200){
      }
      else if(refrshReq.status === 401){
        localStorage.removeItem('email');
        navigate('/');
      }
    }
    }
}

useEffect(()=>{
getInfo();
 setTimeout(()=>{
        setEnabler(false);
    }, 2000) 
}, [accesstoken]);

useEffect(()=>{
    setbalance(info?.Balance);
    setIncome(info?.TotalIncome);
    setExpense(info?.TotalExpense);
    setrecentIncome(info?.recentIncome);
    setrecentExpense(info?.recentExpense);
    setentertainment(info?.Entertainment);
    setfood(info?.Food);
    sethealthcare(info?.Healthcare);
    setothers(info?.Others);
    setutils(info?.Utilities);
    setshopping(info?.Shopping);
    settransport(info?.Transportation);
},[info])


const logout = async() => {

try{
const res = await axios.get("https://login-backend-izl3.onrender.com/log/out",{
        withCredentials: true,
        headers: {
            Authorization: `<Bearer> ${accesstoken}`
        }
    })
    if(res.status === 200){
        localStorage.removeItem('email');
        navigate('/')
    }
    else{
        localStorage.removeItem('email');
        navigate('/')
    }
    
    

}catch(err){
    if(err.response?.status === 401){
        //message block user not authorized
     localStorage.removeItem('email');
        navigate('/')
    }

    else if(err.response?.status === 500){
        // message block server error
        alert("server error");
        navigate('/')
    }
}
}
//379
//425

const closeSide = () => {
setShowSide(false);
}
const openSide = () =>{
    setShowSide(true);
}

    return(<>
  { <aside className={!side ? "sidebar" : "sidebar active"}>
        <span class="material-symbols-outlined close" onClick={closeSide}>
                close
        </span>
        <div className="user-section">
            <div className="user-profile">
                <div className="user-avatar">
                    {!skeletonEnabler ?<svg className="icon" fill="white" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg> : <Skeleton width='50px' baseColor="#435465ff" circle = {true}/>}
                </div>
                <div className="user-info">
                   {!skeletonEnabler? <p className="para">{email.length > 23 ? `${email.slice(0,2)}...`: email}</p> :<Skeleton width='100px' baseColor="#435465ff"/>}
                </div>
            </div>
        </div>

        <nav className="nav-menu">
            <ul>
                <li>
                    {!skeletonEnabler ?<a href="#" className="active">
                        <svg className="icon" fill="white" viewBox="0 0 24 24">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Dashboard
                    </a>: <Skeleton height='50px' baseColor="#435465ff"/>}
                </li>
                <li>
                    {!skeletonEnabler ?<Link to="/incomepage">
                        <svg className="icon" fill="white" viewBox="0 0 24 24">
                            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                        </svg>
                        Income
                    </Link>: <Skeleton height='50px' baseColor="#435465ff"/>}
                </li>
                <li>
                    {!skeletonEnabler? <Link to = "/expensepage">
                        <svg className="icon" fill="white" viewBox="0 0 24 24">
                            <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
                        </svg>
                        Expense
                    </Link>: <Skeleton height='50px' baseColor="#435465ff"/>}
                </li>
            </ul>
        </nav>

        <div className="logout-section">
            <button className="logout-btn" onClick={logout}>
                <svg className="icon" fill="white" viewBox="0 0 24 24">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Logout
            </button>
        </div>
    </aside>} 

   
    <main className="main-content">
        <header className="header">
            <span class="material-symbols-outlined menu" onClick={openSide}>
                menu
            </span>
            <h1>Dashboard</h1>
        </header>

        <div className="content">
          
            <div className="cards-container">
                {!skeletonEnabler ?<div className="financial-card">
                    <div className="card-content">
                        <div className="card-title">Current Balance</div>
                        <div className="card-amount" style={{"color": "#f39c12"}}>${balance.toFixed(2)}</div>
                    </div>
                    <div className="card-icon balance-icon">
                        <svg className="icon" fill="#f39c12" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.81.45 1.61 1.67 1.61 1.16 0 1.6-.64 1.6-1.46 0-.84-.68-1.22-1.88-1.71-1.75-.64-3.37-1.33-3.37-3.68 0-1.71 1.39-2.84 3.08-3.14V4h2.67v2.26c1.17.25 2.6.89 2.76 2.8h-1.96c-.1-.66-.39-1.32-1.48-1.32-1.03 0-1.54.53-1.54 1.26 0 .77.69 1.12 1.88 1.55 1.79.68 3.45 1.33 3.45 3.73 0 1.9-1.43 3.04-3.49 3.81z"/>
                        </svg>
                    </div>
                </div>: <Skeleton  height='100px'/>}

               { !skeletonEnabler?<div className="financial-card">
                    <div className="card-content">
                        <div className="card-title">Total Income</div>
                        <div className="card-amount" style={{"color": "#27ae60"}}>${income.toFixed(2)}</div>
                    </div>
                    <div className="card-icon income-icon">
                        <svg className="icon" fill="#27ae60" viewBox="0 0 24 24">
                            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                        </svg>
                    </div>
                </div>: <Skeleton height='100px'/>}

                {!skeletonEnabler ?<div className="financial-card">
                    <div className="card-content">
                        <div className="card-title">Total Expenses</div>
                        <div className="card-amount" style={{"color": "#e74c3c"}}>${expense.toFixed(2)}</div>
                    </div>
                    <div className="card-icon expense-icon">
                        <svg className="icon" fill="#e74c3c" viewBox="0 0 24 24">
                            <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
                        </svg>
                    </div>
                </div> : <Skeleton height='100px'/>}
            </div>

           
            <div className="two-column">
               <div>
                    {!skeletonEnabler ? <div className="section-card">
                    <div className="section-header">
                        <h2 className="section-title">Expense Transactions</h2>
                    </div>
                    <div className="transaction-list">
                    {recentExpense.map((expense,_)=>{
                        return(
                    
                        <div className="transaction-item" key={expense._id}>
                            <div className="transaction-details">
                                <div className="transaction-name">{expense.Category}</div>
                                <div className="transaction-date">{expense.Date}</div>
                            </div>
                            <div className="transaction-amount amount-expense">-${expense.Amount}</div>
                        </div>
                        )
                    })
                        }
                         </div>
                </div> : <Skeleton width='470px' height= '200px'/>}
                {!skeletonEnabler ? <div className="section-card">
                    <div className="section-header">
                        <h2 className="section-title">Income Transactions</h2>
                    </div>
                    <div className="transaction-list">
                        {
                         recentIncome.map((income,_)=>{
                          return(
                                <div className="transaction-item" key={income._id}>
                            <div className="transaction-details">
                                <div className="transaction-name">{income.Source}</div>
                                <div className="transaction-date">{income.Date}</div>
                            </div>
                            <div className="transaction-amount amount-income">+${income.Amount}</div>
                      </div>
                          )  
                         })   
                        }
                    </div>
                    
                </div> : <Skeleton width='470px' height= '200px'/>}
               </div>
        {!skeletonEnabler?<div className="section-card">
            <div className="section-header">
                    <h2 className="section-title">Financial Overview</h2>
            </div>
                    <div className="chart-legend">
                        <Doughnut 
                        data = {data}
                        options = {options}
                        ></Doughnut>
                    </div>
                </div> : <Skeleton  width='400px' height= '400px'/>}
            </div>
        </div>
           { !skeletonEnabler ?<div class="bar-chart-section">
                <h2 class="section-title">Category Statistics</h2>
                <div class="bar-chart-container">
                    <div class="bar-item">
                        <div class="bar-label">Healthcare</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill bar-income" style={{width: healthcare?.toFixed(0) + "%"}}></div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Food & Dining</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill bar-income" style={{width: food?.toFixed(0) + "%"}}></div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Transportation</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill bar-income" style={{width: transport?.toFixed(0) + "%"}}></div>
                         </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Utilities</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill bar-income" style={{width: utils?.toFixed(0) + "%"}}></div>
                         </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Entertainment</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill bar-income" style={{width: Entertainment?.toFixed(0) + "%"}}></div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Others</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill bar-income" style={{width: others?.toFixed(0) + "%"}}></div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Shopping</div>
                        <div class="bar-wrapper">
                            <div class="bar-fill bar-income" style={{width: shopping?.toFixed(0) + "%"}}></div>
                        </div>
                    </div>
             </div>
        </div> : <Skeleton  width='900px' height= '400px' baseColor="#eeeeeeff" style={{ marginLeft: "30px" }}/>}
    </main>
    </>
    )
}


export default Dashboard

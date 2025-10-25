import React, { useContext, useEffect, useState } from 'react';
import './income.css';
import {Message} from '../UI extras/message-div';
import axios from 'axios';
import TokenContext from '../accessContext/tokenContext';
import { useNavigate } from 'react-router-dom';
import { TableData } from './TableData';



export function IncomePage(){
const navigate = useNavigate();
const {accesstoken, setAccess} = useContext(TokenContext);
const [message, setmessage] = useState("");
const [show, setShow] = useState(false);
const [isDisabled, setDisabled] = useState(true);
const [income, setIncome] = useState({
    source: "",
    amount: 0,
    date:"",
    paymentMethod:"",
    description:""
})    
const [page, setPage] = useState([]);
const [pageNum, setPageNum] = useState([]);
const[sendNum, setNum] = useState(1);
const[limit, setLimit] = useState(10);
const[total, setTotal] = useState(JSON.parse(localStorage.getItem('total')) || 0);
const [selectedNum, setSelectedNum] = useState(1);


const OnMountrefresh = async() => {
    let newToken
     try{
         const res = await axios.get('https://login-backend-izl3.onrender.com/refresh/jwt',
        {
            withCredentials: true
        }
    );
    if(res){
         newToken = res.data?.accessToken;
        setAccess(res.data?.accessToken);
}

    if(newToken){
        const config = {
            params: {
            page: 1,
            limit: limit
        },
        headers:{
            Authorization:`<Bearer> ${newToken}`
        }
        }
        const res = await axios.get("https://login-backend-izl3.onrender.com/get/entries", config)
        setPage(res.data?.Entries)
        setPageNum(res.data?.totalEntries);
        
    }
     }catch(err){
           if(err.response?.status === 401){
            localStorage.removeItem('email');
                navigate('/');
            }
            if(err.response?.status === 500){
                userMessage("server is down");
            }
            if(err.response?.status === 400){
                userMessage('something went wrong');
                navigate('/')
                //navigate to the login page
            }

}  
    }


 useEffect(()=>{
    OnMountrefresh();
 }, [])


const send = async() =>{
     const config = {
            params: {
            page: sendNum,
            limit: limit
        },
        headers:{
            Authorization:`<Bearer> ${accesstoken}`
        }
        }
        try{
        const res = await axios.get("https://login-backend-izl3.onrender.com/get/entries", config)
        setPage(res.data?.Entries)
        setPageNum(res.data?.totalEntries);
        setTotal(res.data?.TotalDocs);
        }
        catch(err){
        if(err.response.status === 401){
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
      if (refrshReq.status === 201){
        userMessage(refrshReq.data?.message)
      }
      else if(refrshReq.status === 401){
        localStorage.removeItem('email');
        navigate('/');
      }
    }
        }
        
}


useEffect(()=>{
    localStorage.setItem('total', JSON.stringify(total));
 }, [total])
 
 useEffect(()=>{
  send();
 }, [sendNum])

useEffect(()=>{
let timeout
if(income.description.split(" ").length >= 5){
    setmessage("Description must be five words or less");
    setShow(true);
    timeout = setTimeout(()=>{
          setmessage("");
          setShow(false);
   }, 2000)
}

 else {
    setmessage("");
    setShow(false)
   }

return ()=> clearTimeout(timeout);
},[income.description])
const clearobj = {
    source: "",
    amount: 0,
    date:"",
    paymentMethod:"",
    description:""
}


const setsource = (event) => {
setIncome({
    ...income,
    [event.target.name]:event.target.value
})
}


const clear = () => {
setIncome(i => {
    return clearobj;
})
}
const userMessage = (message) =>{
  setmessage(message);
        setShow(true);
         setTimeout(()=> {
            setShow(false);
        }, 3000)
}

const addIncome = async(e) => {
    e.preventDefault();
   let obj = {...income}
   const newAmount = Number(obj.amount);
   obj.amount = newAmount;
   const incomeRoute = 'https://login-backend-izl3.onrender.com/add/income';
   const authheader = `<Bearer> ${accesstoken}` ;

   try{
    const res = await axios.post(incomeRoute, obj, {
        headers: {
            Authorization: authheader 
        }
    })
     if(res.status === 201){
        userMessage(res.data?.message);
        send();
    }
   }
   catch(err){
    if(err.response?.status === 400){
        userMessage("To many words please");        
    }
    if(err.response?.status === 500){
        userMessage("server is Down");
    }
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
      if (refrshReq.status === 201){
        userMessage(refrshReq.data?.message)
      }
      else if(refrshReq.status === 401){
        localStorage.removeItem('email');
        navigate('/');
      }
    }
   }
    
}
const changePage = async(key) => {
const page = key;
if(key > 1){
    setDisabled(false);
}
else{
   setDisabled(true); 
}
setNum(page);
setSelectedNum(page);
}

const nextPage = () => {
let next = sendNum + 1;
setDisabled(false);
if(!pageNum.includes(next)){
    next = 1;
    setDisabled(true);
}
setNum(next);
setSelectedNum(next);
}

const previousPage = () => {
    let previous = sendNum - 1
    if(!pageNum.includes(previous) || previous === 1){
        setDisabled(true);
    }
    setNum(previous);
    setSelectedNum(previous);
}

const delEntry = (id) => {
const newPages = page.filter((entry,_)=>{
    return entry._id !== id
})
setPage(newPages);
setTotal(t => {
    return t - 1
})
}
 
return(<>
 <Message Message={message} show = {show}/>
 <main class="income-page">
        <div class="page-header">
            <h1>Income Page</h1>
            <p>Track and manage your income sources</p>
        </div>

        
        <div class="add-income-card">
            <h2>Add New Income</h2>
            <form>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="income-source">Income Source</label>
                        <select id="income-source" name='source' onChange={setsource}>
                            <option value="">Select source</option>
                            <option value="salary">Salary</option>
                            <option value="freelance">Freelance</option>
                            <option value="investment">Investment</option>
                            <option value="business">Business</option>
                            <option value="rental">Rental</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="amount">Amount</label>
                        <input type="number" id="amount" placeholder="0.00" step="0.01" name='amount' onChange={setsource} required/>
                    </div>
                    <div class="form-group">
                        <label for="date">Date</label>
                        <input type="date" id="date" name='date' onChange={setsource} required/>
                    </div>
                    <div class="form-group">
                        <label for="payment-method">Payment Method</label>
                        <select id="payment-method" name='paymentMethod' onChange={setsource} required>
                            <option value="">Select method</option>
                            <option value="bank-transfer">Bank Transfer</option>
                            <option value="cash">Cash</option>
                            <option value="check">Check</option>
                            <option value="paypal">PayPal</option>
                            <option value="crypto">Cryptocurrency</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" placeholder="Add notes about this income..." name='description' onChange={setsource} required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onClick={clear}>Cancel</button>
                    <button type="submit" class="btn btn-primary" onClick={addIncome} >Add Income</button>
                </div>
            </form>
        </div>

        
       
    
       
        <div class="income-table-card">
            <h2>Income History</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Source</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                   {page.length > 0? <TableData page= {page} 
                   delEntry ={delEntry} 
                   accesstoken = {accesstoken} 
                   setAccess = {setAccess} 
                   setmessage = {userMessage} 
                   /> 
                   : 
                   "No entries avalaible"}                 
                     </tbody>
                </table>
            </div>

           
            <div class="pagination">
                <div class="pagination-info">
                   {` Showing 1 to ${page.length} of ${total} entries`}
                </div>
                <div class="pagination-controls">
                    <button class="pagination-btn" disabled = {isDisabled} onClick={previousPage}>Previous</button>
                    
                        {pageNum.map((num,_)=>{
                            return(
                                <button className="page-number" key={num} onClick={()=>{changePage(num)}}
                                style={{backgroundColor: selectedNum === num ? "#0c8c2cff" : "#fff", color:selectedNum === num ? "#fff" : "#000"}}>{num}</button>
                            ) 
                       })    
                    }
                    
                    <button class="pagination-btn" onClick={nextPage}>Next</button>
                </div>
            </div>
        </div>
    </main>
   </>
)
}

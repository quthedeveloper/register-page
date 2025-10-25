import axios from "axios"

export function TableData({ page, delEntry, accesstoken, setmessage}){

const del = async(id) => {
const config = {
    params: {
        id: id
    },
     headers:{
            Authorization:`<Bearer> ${accesstoken}`
        }
    
}
try{
const res = await axios.post("https://login-backend-izl3.onrender.com/delete/entry", null , config);
if (res.status === 200){
    delEntry(id);
    setmessage(res.data?.message);
}

}catch(err){
    if(err.response.status === 404){
        console.log(err);
    }
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
      if (refrshReq.status === 200){
        delEntry(id);
      }
      else if(refrshReq.status === 401){
        localStorage.removeItem('email');
        navigate('/');
      }
    }
}


}


return(
page.map((page, i)=>{
return(
    <tr key={page._id}>
        <td className="date">{page.Date}</td>
    <td><span class="source-badge source-salary">{page.Source}</span></td>
    <td>{page.Description}</td>
    <td>${page.Amount}</td>
    <td>
        <div class="action-buttons">
            <button class="action-btn" onClick={()=>{del(page._id)}}>Delete</button>
        </div>
    </td>
</tr>
)

})
)
}
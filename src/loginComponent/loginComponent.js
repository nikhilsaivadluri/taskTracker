import React, { useState} from "react";
import './loginComponent.css';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import config from '../config';
function LoginComponent()
{
    const [id,setId] = useState();
    const [name,setName] = useState();
    const history = useHistory();

    const handleSubmit = (e)=>{
     
         let payload ={
            name:name,
            id: id
        };
        axios.post(`${config.apiUrl}/login`,payload)
        .then(res => {
         console.log(res);
         localStorage.setItem("token",res.data.token.token);
         localStorage.setItem("currentuser",res.data.token.name);
         localStorage.setItem("imageUrl",res.data.image)
         history.push("/dashboard");
        },error=>{
            console.log(error);
        })
       

        
    }

    return (

        <div className="main">

         <div className="login">
             <span className="title">Login</span>
             <div className="form">
             <input className="input" type="text" onChange={e => setId(e.target.value)} value={id} placeholder="Id" />
             <input className="input" type="text" onChange={e => setName(e.target.value)} value={name} placeholder="Name" />
             <button className="btn btn-primary btn-login" onClick={()=>handleSubmit()}>Login</button>
             </div>
         </div>

        </div>
    )
}
export default LoginComponent;
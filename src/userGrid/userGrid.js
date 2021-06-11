import React, { useState, useEffect } from "react";
import  './userGrid.css';
import axios from 'axios';
const headers={
    'Authorization':localStorage.getItem("token"),
    'Content-Type': "application/json"
}
function UserGridComponent()
{   

    const [users, setUsers] = useState([]);

    useEffect(()=>{
    
        axios.get(`https://randomuser.me/api/?page=1&results=30`,{headers})
        .then(res => {
                 setUsers(res.data.results);
                 console.log(res);
        })
    },[]);
    
    let userCards = users.map((user,index)=>{
        let date = new  Date(user.dob.date);
        return (
        <div key={index} className="col-sm-3 cards">
        <img className="profileImage" src={user.picture.large} alt={user.first}/>
        <span className="usertitle">{user.name.title+". "+user.name.first+" "+ user.name.last}</span>
        <p className="dob-label">{date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()}</p>
        <p className="email-label">{user.email}</p>  
      </div>)
    })

    return(<div className="row col-sm-12 grid">{userCards}</div>)
}

export default UserGridComponent;
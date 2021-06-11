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
        let dob = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
        let username = user.name.title+". "+user.name.first+" "+ user.name.last;
        return (
        <div key={index} className="col-sm-3 cards">
        <img className="profileImage" src={user.picture.large} alt={user.first}/>
        <span className="usertitle">{username}</span>
        <p className="dob-label">{dob}</p>
        <p className="email-label">{user.email}</p>  
      </div>)
    })

    return(<div className="row col-sm-12 grid">{userCards}</div>)
}

export default UserGridComponent;
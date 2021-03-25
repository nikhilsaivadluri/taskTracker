import React, { useState, useEffect } from "react";
import './dashBoardComponent.css';
import profile from './../assets/profile.png'

class DashBoardComponent extends React.Component {

    render() {
        return (
            <div className="dashmain"> 
                <Header username="Nikhil" />
            </div>
        )
    } 
}

function Header({username})
{
    return( 
        <div className="header">
            <div className="header-content">
            <img src={profile} height="48px" width="48px" />
            <span style={{padding:"0px 16px"}}>{username}</span>
            <span className="right">Logout</span>
            </div>
        </div>
    )
}

export default DashBoardComponent;
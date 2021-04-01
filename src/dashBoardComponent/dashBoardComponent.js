import React, { useState, useEffect } from "react";
import  './dashBoardComponent.css';
import profile from './../assets/profile.png'
import trash from './../assets/trash-solid.svg'
import edit from './../assets/pen-solid.svg'
import Modal from 'react-bootstrap/Modal'
import Chart from "react-apexcharts";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import config from '../config';

function DashBoardComponent() {
    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editTaskDetails,setEditTaskDetails] = useState({name:"",completed:false}); 
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);

    const [taskName, setTaskName] = useState("");
    const [chartData,setChartData]= useState([]);
    
    const [dashboardData,setDashboardData] = useState();
    const [dataChanged,setDataChanged] =useState(0);
    const headers={
        'Authorization':localStorage.getItem("token"),
        'Content-Type': "application/json"
    }
    const username=localStorage.getItem("currentuser");
    useEffect(()=>{
    
      axios.get(`${config.apiUrl}/dashboard`,{headers})
      .then(res => {
         console.log(res);
         setDashboardData(res.data);
         setChartData([res.data.tasksCompleted,res.data.totalTasks-res.data.tasksCompleted]);

         if(res.data.totalTasks!==0)
         {
            axios.get(`${config.apiUrl}/tasks`,{headers})
            .then(res => {
                setTasks(res.data);
                setFilteredTasks(res.data);
            }).catch((error)=>{
                console.log(error.response.data.message);
                alert(error.response.data.message);
            })
         }
      }).catch((error)=>{
        console.log(error.response.data.message);
        alert(error.response.data.message);
    })
     
    },[dataChanged]);

    let chartOptions = {
        labels: ["Completed Tasks", "Pending Tasks"],
        colors: ["#5285EC", "#E5E5E5"],
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        }
    }

    let latestTasks = (dashboardData!=null) ? dashboardData.latestTasks:[];
    let latestTasksList = latestTasks.map(task => {
        if (task.completed)
            return (<li className="list-wrap striked" key={task._id}>{task.name}</li>)
        else
            return (<li className="list-wrap" key={task._id}>{task.name}</li>)
    })

    let totalList = filteredTasks.map((task,index) => {
        return (<li key={task._id}>
            <div className="row" style={{alignItems:"baseline"}}>
                <div className="col-sm-1 col-2"> <input className="custom-checkbox" type="checkbox" checked={task.completed} onChange={(e) => changeCompletionStatus(task,e.target.checked)} /></div>
                {!task.completed && <div className="col-sm-9 col-6 text-left active-task"> <span style={{display:"block"}} className="list-wrap">{task.name}</span></div>}
                {task.completed && <div className="col-sm-9 col-6 text-left deactive-task"> <span style={{display:"block"}}  className="list-wrap striked">{task.name}</span></div>}
                <div className="col-sm-2 col-4 text-right">
                    <img className="icon" src={edit} height="16px" width="16px" alt="edit" onClick={() => onEdit(task)} />
                    <img className="icon" src={trash} height="16px" width="16px" alt="trash" onClick={() => deleteTask(task._id)} />
                </div>
            </div>
            {(tasks.length-1)!==index && <div className="task-separator"></div> }
        </li>)
    })
    
    function searchByTaskname(taskname)
    {
       let filteredtasks = tasks.filter(task=>{
               if((task.name).toLowerCase().includes(taskname.toLowerCase()))
                   return true;
                else
                 return false;   
       });
       if(taskname==="")
           setFilteredTasks(tasks);
       else
        setFilteredTasks(filteredtasks);

    } 

    function onEdit(task)
    {
       
        setEditTaskDetails(task);
        setEditModalShow(true);
    }

     function changeCompletionStatus(task,isCompleted)
    {
        let payload={ ...task,completed:isCompleted};
        axios.put(`${config.apiUrl}/tasks/${task._id}`,payload,{headers})
        .then(res => {
         console.log(res);
         setDataChanged(dataChanged+1);
        }).catch((error)=>{
            console.log(error.response.data.message);
            alert(error.response.data.message);
        })
    }


    function deleteTask(id) {

        axios.delete(`${config.apiUrl}/tasks/${id}`,{headers})
        .then(res => {
         console.log(res);
         setDataChanged(dataChanged+1);
        })
        .catch((error)=>{
            console.log(error.response.data.message);
            alert(error.response.data.message);
        })
    }

    function addTask() {

        let payload={name: taskName};
        axios.post(`${config.apiUrl}/tasks`,payload,{headers})
        .then(res => {
         console.log(res);
         setModalShow(false);
         setDataChanged(dataChanged+1);
        }).catch((error)=>{
            console.log(error.response.data.message);
            alert(error.response.data.message);
        })
    }

    function updateTask()
    {
        let payload={ name:editTaskDetails.name,completed:editTaskDetails.completed};
        axios.put(`${config.apiUrl}/tasks/${editTaskDetails._id}`,payload,{headers})
        .then(res => {
         console.log(res);
         setEditModalShow(false);
         setDataChanged(dataChanged+1);
        }).catch((error)=>{
            console.log(error.response.data.message);
            alert(error.response.data.message);
        })
    }

    return (
        <div className="dashmain">
            <Header username={username} />
            { dashboardData!=null && dashboardData.totalTasks  === 0 && <div className="notask-body">
                <div className="card">
                    <span className="card-content">You have no task.</span>
                    <button className="btn btn-primary" onClick={() => setModalShow(true)}>+ New Task</button>
                </div>
               

            </div>}
            { dashboardData!=null && dashboardData.totalTasks!==0  && <div>
                <div  className="row mr-lr-0 contentCenter">
                    <div className="col-sm-3 col-12 text-left summaryCard">
                        <h1 className="card-title">Tasks Completed</h1>
                        <span style={{ color: "#5285EC", fontSize: "64px" }}>{dashboardData.tasksCompleted}</span>
                        <span style={{ fontSize: "24px" }}>/{dashboardData.totalTasks}</span>
                    </div>
                    <div className="col-sm-3 col-12 text-left summaryCard">
                        <h1 className="card-title">Latest Created Tasks</h1>
                        <ul className="card-list">{latestTasksList}</ul>
                    </div>
                    <div className="col-sm-3 col-12 contentCenter summaryCard">
                        <Chart options={chartOptions} series={chartData} type="pie" height="130px" width="130px" />
                    </div>
                </div>
                <div className="row mr-lr-0 listCard-heading">
                    <div className="offset-sm-1 col-sm-1 col-12 pd-7  card-title listCard-Options contentCenter"><span className="mr-tb-10 text-center">Tasks</span></div>
                    <div className="offset-sm-4 col-sm-3 col-12 pd-7"><input className="inputbox searchbox" type="text"  placeholder="search by task name" onChange ={(e)=> searchByTaskname(e.target.value)} /></div>
                    <div className="col-sm-2 col-12 pd-25 listCard-Options"><button style={{width:"100%"}}  className="btn btn-primary mr-tb-10" onClick={() => setModalShow(true)} >+New Task</button></div>

                </div>
                <div className="row mr-lr-0 contentCenter">
                    <div className="col-sm-10 col-12 listCard">
                    <ul className="card-list list-unstyled mr-bt-0">{totalList}</ul>
                    </div>
                </div>

            </div>}
            <Modal
             show={modalShow}
             onHide={() => setModalShow(false)}
            size="sm"
            aria-labelledby="Add Task"
            centered
            className="modal"
            > 
            <Modal.Body style={{ padding: "24px 24px"}}>
                <h4 className="card-title">+ New Task</h4>
                <input type="text" className="inputbox" placeholder="Task Name" onChange={(e) => setTaskName(e.target.value)} />
                <button className="btn btn-primary custom-button" onClick={() => addTask()}>+ New Task</button>
            </Modal.Body>

        </Modal>
        <Modal
             show={editModalShow}
             onHide={() => setEditModalShow(false)}
            size="sm"
            aria-labelledby="Edit Task"
            centered
            className="modal"
            > 
            <Modal.Body style={{ padding: "24px 24px"}}>
                <h4 className="card-title">Update Task</h4>
                <input type="text" className="inputbox" value={editTaskDetails.name} placeholder="Task Name" onChange={(e) => setEditTaskDetails({...editTaskDetails,name:e.target.value})} />
                <button className="btn btn-primary custom-button" onClick={() => updateTask()}>Update Task</button>
            </Modal.Body>

        </Modal>


        </div>
    )

}

function Header({ username }) {
    const history = useHistory();
    return (
        <div className="row header mr-lr-0">
            <div className="col-sm-2 offset-sm-1 col-2 profile">
                 <img src={profile} height="48px" width="48px" alt="profile"/>
                 <span style={{ padding: "0px 16px" }}>{username}</span>
            </div>     
            <div className="col-sm-2 offset-sm-6 col-3 offset-7 logout"><span className="logout" onClick={()=>history.push("/login")}>Logout</span></div>
        </div>
    )
}

export default DashBoardComponent;
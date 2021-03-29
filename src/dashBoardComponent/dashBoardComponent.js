import React, { useState, useEffect } from "react";
import  './dashBoardComponent.css';
import profile from './../assets/profile.png'
import trash from './../assets/trash-solid.svg'
import edit from './../assets/pen-solid.svg'
import Modal from 'react-bootstrap/Modal'
import Chart from "react-apexcharts";
import { useHistory } from "react-router-dom";

function DashBoardComponent() {
    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editTaskID,setEditTaskId] = useState(0); 
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [completedTasks,setCompletedTasks] = useState(0);
    const [chartData,setChartData]= useState([]);
    useEffect(()=>{
      let savedTasks = JSON.parse(localStorage.getItem("tasks"));
      setTasks(savedTasks);
      getCompletionStatus();
    
     
    },[]);

    let series = [5, 15];
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

    let latestTasks = (tasks.length > 3) ? tasks.slice(tasks.length - 3, tasks.length) : tasks;
    let latestTasksList = latestTasks.map(task => {
        if (task.completed)
            return (<li className="list-wrap striked" key={task.id}>{task.name}</li>)
        else
            return (<li className="list-wrap" key={task.id}>{task.name}</li>)
    })


    let totalList = tasks.map((task,index) => {
        return (<li key={task.id}>
            <div className="row" style={{alignItems:"baseline"}}>
                <div className="col-sm-1 col-2"> <input className="custom-checkbox" type="checkbox" checked={task.completed} onChange={(e)=> changeCompletionStatus(task.id,e.target.checked)} /></div>
                {!task.completed && <div className="col-sm-9 col-6 text-left active-task"> <span className="list-wrap">{task.name}</span></div>}
                {task.completed && <div className="col-sm-9 col-6 text-left deactive-task"> <span className="list-wrap striked">{task.name}</span></div>}
                <div className="col-sm-2 col-4 text-right">
                    <img className="icon" src={edit} height="16px" width="16px" alt="edit" onClick={() => onEdit(task.id,task.name)} />
                    <img className="icon" src={trash} height="16px" width="16px" alt="trash" onClick={() => deleteTask(task.id)} />
                </div>
            </div>
            {(tasks.length-1)!==index && <div className="task-separator"></div> }
        </li>)
    })
    
    function onEdit(id,name)
    {
        setEditModalShow(true);
        setEditTaskId(id);
        setTaskName(name);
    }


    function deleteTask(id) {
        let index = tasks.findIndex((task, index, array) => {
            return task.id === id;
        });
        let temp =tasks;
        temp.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(temp));
        setTasks(temp);
        getCompletionStatus();
    }

    function addTask() {
        
        setModalShow(false);
        let temp = JSON.parse(localStorage.getItem("tasks"));
        var d = new Date();
        var timestamp = d.getTime();
        temp.push({ id: timestamp, name: taskName, completed: false });
        //setCount(count + 1);
        localStorage.setItem("tasks", JSON.stringify(temp));
        setTasks(temp);
        getCompletionStatus();
    }

    function updateTask()
    {
        let index = tasks.findIndex((task, index, array) => {
            return task.id === editTaskID;
        });
        let temp =tasks;
        temp[index].name=taskName;
        localStorage.setItem("tasks", JSON.stringify(temp));
        setTasks(temp);
        setEditModalShow(false);
    }

    function getCompletionStatus()
    {
        let completedtasks=0;
        tasks.forEach(task =>{
            if(task.completed)
            completedtasks++;
        });
        setCompletedTasks(completedtasks);
        setChartData([completedtasks,tasks.length-completedtasks]);
       
    }

    function changeCompletionStatus(id,checkedStatus)
    {
       let totalTasks=tasks;
       let index = tasks.findIndex((task, index, array) => {
        return task.id === id;
        });
        totalTasks[index].completed=checkedStatus;
        setTasks(totalTasks);
        localStorage.setItem("tasks",JSON.stringify(tasks));
        getCompletionStatus();
    }

    return (
        <div className="dashmain">
            <Header username="Nikhil" />
            { tasks.length === 0 && <div className="notask-body">
                <div className="card">
                    <span className="card-content">You have no task.</span>
                    <button className="btn btn-primary" onClick={() => setModalShow(true)}>+ New Task</button>
                </div>
               

            </div>}
            { tasks.length !== 0 && <div>
                <div  className="row mr-lr-0 contentCenter">
                    <div className="col-sm-3 col-12 text-left summaryCard">
                        <h1 className="card-title">Tasks Completed</h1>
                        <span style={{ color: "#5285EC", fontSize: "64px" }}>{completedTasks}</span>
                        <span style={{ fontSize: "24px" }}>/{tasks.length}</span>
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
                    <div className="offset-sm-4 col-sm-3 col-12 pd-7"><input className="inputbox" type="text" placeholder="search by task name" /></div>
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
                <input type="text" className="inputbox" value={taskName} placeholder="Task Name" onChange={(e) => setTaskName(e.target.value)} />
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
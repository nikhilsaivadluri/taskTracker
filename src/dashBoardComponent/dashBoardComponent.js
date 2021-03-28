import React, { useState, useEffect } from "react";
import  './dashBoardComponent.css';
import profile from './../assets/profile.png'
import trash from './../assets/trash-solid.svg'
import edit from './../assets/pen-solid.svg'
import Modal from 'react-bootstrap/Modal'
import Chart from "react-apexcharts";


function DashBoardComponent() {
    const [modalShow, setModalShow] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [completedTasks,setCompletedTasks] = useState(0);
    useEffect(()=>{
      let savedTasks = JSON.parse(localStorage.getItem("tasks"));
      setTasks(savedTasks);
      getCompletionStatus();
    
     
    },[]);

    let styles = {
        body: {
            height: "628px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        dashmain: {
            backgroundColor: "#F4F4F6",
            height: "700px",
            width: "100%",
        },
        notask: {
            card: {
                width: "304px",
                height: "158px",
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                boxShadow: "0px 3px 6px #0000000A",
                borderRadius: "12px",
                opacity: 1,
                display: "flex",
                flexDirection: "column",
                padding: "37px 64px"
            },
            heading: {
                textAlign: "center",
                font: "normal normal medium 20px/28px Montserrat",
                letterSpacing: "0px",
                color: "#537178",
                opacity: "1"
            }
        },
        addTask:{
            modal: {
                width: '296px',
                height: '195px',
                background: "#FFFFFF",
                boxShadow: "0px 3px 6px #00000029",
                borderRadius: "12px",
                opacity: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            },
            inputbox: {
                width: "100%",
                margin: "18px 0px",
                background: "#e5e5e5",
                border: "1px #e5e5e5",
                padding: "9px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#7A7D7E",
            },
            button: {
                width: "100%",
                fontSize: "14px"
            },
            heading: {
                fontSize: "20px",
                color: "#537178"
            }
        }

    }

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


    let totalList = tasks.map(task => {
        return (<li key={task.id}>
            <div className="row">
                <input type="checkbox" onChange={(e)=> changeCompletionStatus(task.id,e.target.checked)} />
                {!task.completed && <span className="list-wrap">{task.name}</span>}
                {task.completed && <span className="list-wrap striked">{task.name}</span>}
                <img src={edit} height="16px" width="16px" alt="edit" />
                <img src={trash} height="16px" width="16px" alt="trash" onClick={() => deleteTask(task.id)} />
            </div>
        </li>)
    })

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

    function getCompletionStatus()
    {
        let completedtasks=0;
        tasks.forEach(task =>{
            if(task.completed)
            completedtasks++;
        });
        setCompletedTasks(completedtasks);
       
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
        <div style={styles.dashmain}>
            <Header username="Nikhil" />
            { tasks.length === 0 && <div style={styles.body}>
                <div style={styles.notask.card}>
                    <span style={styles.notask.heading}>You have no task.</span>
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
                        <Chart options={chartOptions} series={series} type="pie" height="130px" width="130px" />
                    </div>
                </div>
                <div className="row mr-lr-0">
                    <div className="offset-sm-1 col-sm-1 col-12 pd-25 text-center">Tasks</div>
                    <div className="offset-sm-4 col-sm-3 col-12 pd-25"><input style={{width:"100%"}} type="text" placeholder="search by task name" /></div>
                    <div className="col-sm-2 col-12 pd-25"><button style={{width:"100%"}}  className="btn btn-primary" onClick={() => setModalShow(true)} >+New Task</button></div>

                </div>
                <div className="row mr-lr-0 contentCenter">
                    <div className="col-sm-8 col-12">
                    <ul className="card-list list-unstyled">{totalList}</ul>
                    </div>
                </div>

            </div>}
            <Modal
             show={modalShow}
             onHide={() => setModalShow(false)}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ border: "0px" }}
            > 
            <Modal.Body style={{ padding: "24px 24px" }}>
                <h4 style={styles.addTask.heading}>+ New Task</h4>
                <input type="text" style={styles.addTask.inputbox} placeholder="Task Name" onChange={(e) => setTaskName(e.target.value)} />
                <button style={styles.addTask.button} className="btn btn-primary" onClick={() => addTask()}>+ New Task</button>
            </Modal.Body>

        </Modal>
        </div>
    )

}

function Header({ username }) {
    const styles = {
        header: {
            display: "flex",
            flexDirection: "row",
            /* padding: 12px 123px; */
            padding: "1% 5%",
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            boxShadow: "0px 3px 6px #00000029",
            opacity: 1,
            height: "72px"
        },
        headerContent: {
            display: "flex",
            flexDirection: "row",
            backgroundColor: "white",
            position: "relative",
            width: "100%",
            alignItems: "center",
            fontFamily: "normal normal medium 19px Montserrat !important",
            letterSpacing: "0px",
            color: "#6D8187",
            opacity: 1,
        },
        right: {
            position: "absolute",
            right: "0px"
        }

    }
    return (
        <div style={styles.header}>
            <div style={styles.headerContent}>
                <img src={profile} height="48px" width="48px" alt="profile"/>
                <span style={{ padding: "0px 16px" }}>{username}</span>
                <span style={styles.right}>Logout</span>
            </div>
        </div>
    )
}

export default DashBoardComponent;
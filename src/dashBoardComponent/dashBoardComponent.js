import React, { useState, useEffect } from "react";
// import styles from './dashBoardComponent.module.css';
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
        summary: {


            row: {
                padding: "1% 11%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            },
            summaryCard: {
                width: "304px",
                height: "158px",
                background: "#FFFFFF",
                boxShadow: "0px 3px 6px #0000000A",
                borderRadius: "12px",
                opacity: 1,
                padding: "24px 24px",
                textAlign: "left",
                color: "#8F9EA2",
            },
            cardTitle: {
                fontSize: "20px",
                textAlign: "left",
                letterSpacing: "0px",
                color: "#537178",
                opacity: 1,
                fontWeight: 400
            },
            listElement: {
                listStylePosition: "inside",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            },
            list: {
                paddingInlineStart: "0px",
                fontSize: "15px"
            },
            editableList: {
                listElement: {
                    listStylePosition: "inside",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                },
                list: {
                    paddingInlineStart: "0px",
                    fontSize: "20px",
                    listStyleType: "none"
                },

            }


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
        let completedStyle = { ...styles.summary.listElement, textDecoration: "line-through" };
        if (task.completed)
            return (<li style={completedStyle} key={task.id}>{task.name}</li>)
        else
            return (<li style={styles.summary.listElement} key={task.id}>{task.name}</li>)
    })


    let totalList = tasks.map(task => {
        let completedStyle = { ...styles.summary.editableList.listElement, textDecoration: "line-through" };
        return (<li key={task.id}>
            <div className="row">
                <input type="checkbox" onChange={(e)=> changeCompletionStatus(task.id,e.target.checked)} />
                {!task.completed && <span style={styles.summary.editableList.listElement}>{task.name}</span>}
                {task.completed && <span style={completedStyle}>{task.name}</span>}
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
                <div style={styles.summary.row}>
                    <div style={styles.summary.summaryCard}>
                        <h1 style={styles.summary.cardTitle}>Tasks Completed</h1>
                        <span style={{ color: "#5285EC", fontSize: "64px" }}>{completedTasks}</span>
                        <span style={{ fontSize: "24px" }}>/{tasks.length}</span>
                    </div>
                    <div style={styles.summary.summaryCard}>
                        <h1 style={styles.summary.cardTitle}>Latest Created Tasks</h1>
                        <ul style={styles.summary.list}>{latestTasksList}</ul>
                    </div>
                    <div style={styles.summary.summaryCard}>
                        <Chart options={chartOptions} series={series} type="pie" height="130px" width="130px" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5 col-12">Tasks</div>
                    <div className="col-md-3 col-12"><input style={{width:"100%"}} type="text" placeholder="search by task name" /></div>
                    <div className="col-md-2 col-12"><button style={{width:"100%"}}  className="btn btn-primary" onClick={() => setModalShow(true)} >+New Task</button></div>

                </div>
                <div style={styles.summary.row}>
                    <ul style={styles.summary.editableList.list}>{totalList}</ul>
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

// function NoTasks(props) {

//     const style = {
//         card: {
//             width: "304px",
//             height: "158px",
//             background: "#FFFFFF 0% 0% no-repeat padding-box",
//             boxShadow: "0px 3px 6px #0000000A",
//             borderRadius: "12px",
//             opacity: 1,
//             display: "flex",
//             flexDirection: "column",
//             padding: "37px 64px"
//         },
//         heading: {
//             textAlign: "center",
//             font: "normal normal medium 20px/28px Montserrat",
//             letterSpacing: "0px",
//             color: "#537178",
//             opacity: "1"
//         }
//     }

//     return (
//         <div style={style.card}>
//             <span style={style.heading}>You have no task.</span>
//             <button className="btn btn-primary" onClick={() => props.showAddTask(true)}>+ New Task</button>
//         </div>

//     )
// }

// function AddNewTask(props) {

//     const [taskName, setTaskName] = useState("");
//     let styles = {
//         modal: {
//             width: '296px',
//             height: '195px',
//             background: "#FFFFFF",
//             boxShadow: "0px 3px 6px #00000029",
//             borderRadius: "12px",
//             opacity: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center"
//         },
//         inputbox: {
//             width: "100%",
//             margin: "18px 0px",
//             background: "#e5e5e5",
//             border: "1px #e5e5e5",
//             padding: "9px 16px",
//             borderRadius: "8px",
//             fontSize: "14px",
//             color: "#7A7D7E",
//         },
//         button: {
//             width: "100%",
//             fontSize: "14px"
//         },
//         heading: {
//             fontSize: "20px",
//             color: "#537178"
//         }
//     }

//     function addTask() {
//         //   console.log(taskname);
//         let temp = JSON.parse(localStorage.getItem("tasks"));
//         var d = new Date();
//         var timestamp = d.getTime();
//         temp.push({ id: timestamp, name: taskName, completed: false });
//         //setCount(count + 1);
//         localStorage.setItem("tasks", JSON.stringify(temp));
//         props.onHide(false);
//         props.setTasks(temp);
//     }

//     return (
//         <Modal
//             {...props}
//             size="sm"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//             style={{ border: "0px" }}

//         >
//             <Modal.Body style={{ padding: "24px 24px" }}>
//                 <h4 style={styles.heading}>+ New Task</h4>
//                 <input type="text" style={styles.inputbox} placeholder="Task Name" onChange={(e) => setTaskName(e.target.value)} />
//                 <button style={styles.button} className="btn btn-primary" onClick={() => addTask()}>+ New Task</button>
//             </Modal.Body>

//         </Modal>
//     );
// }






export default DashBoardComponent;
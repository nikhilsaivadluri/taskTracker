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
    const [count, setCount] = useState(0);

    useEffect(() => {

        localStorage.setItem("tasks", JSON.stringify(tasks));


    }, tasks);
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
        }
    }

    function addTask(taskname) {
        console.log(taskname);
        let temp = tasks;
        temp.push({ id: count + 1, name: taskname, completed: false });
        setCount(count + 1);
        setTasks(temp);
    }

    return (
        <div style={styles.dashmain}>
            <Header username="Nikhil" />
            { count === 0 && <div style={styles.body}>
                <NoTasks showmodal={setModalShow} />
                <AddNewTask
                    addTasks={addTask}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />

            </div>}
            { count !== 0 && <Summmary />}
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
                <img src={profile} height="48px" width="48px" />
                <span style={{ padding: "0px 16px" }}>{username}</span>
                <span style={styles.right}>Logout</span>
            </div>
        </div>
    )
}

function NoTasks(props) {

    const style = {
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
    }

    return (
        <div style={style.card}>
            <span style={style.heading}>You have no task.</span>
            <button className="btn btn-primary" onClick={() => props.showmodal(true)}>+ New Task</button>
        </div>

    )
}

function AddNewTask(props) {

    let styles = {
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

    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ border: "0px" }}

        >
            <Modal.Body style={{ padding: "24px 24px" }}>
                <h4 style={styles.heading}>+ New Task</h4>
                <input type="text" style={styles.inputbox} placeholder="Task Name" />
                <button style={styles.button} className="btn btn-primary" onClick={() => props.addTasks("nikhi")}>+ New Task</button>
            </Modal.Body>

        </Modal>
    );
}

function Summmary() {
    let Styles = {


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


    }
    let tasks = [
        { id: 1, name: "Clean the room", completed: false },
        { id: 2, name: "Buy some vegetables, chicken & chips", completed: false },
        { id: 3, name: "Reinstall windows on PC", completed: true },
    ];

    let latestTasks = tasks.map(task => {
        let completedStyle = { ...Styles.listElement, textDecoration: "line-through" };
        if (task.completed)
            return (<li style={completedStyle} key={task.id}>{task.name}</li>)
        else
            return (<li style={Styles.listElement} key={task.id}>{task.name}</li>)
    })

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

    let chartCard = {
        ...Styles.summaryCard,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

    let totalList = tasks.map(task => {
        let completedStyle = { ...Styles.editableList.listElement, textDecoration: "line-through" };
        return (<li key={task.id}>
            <div className="row">
                <input type="checkbox" />
                {!task.completed && <span style={Styles.editableList.listElement}>{task.name}</span>}
                {task.completed && <span style={completedStyle}>{task.name}</span>}
                <img src={edit} height="16px" width="16px" />
                <img src={trash} height="16px" width="16px" />
            </div>
        </li>)
    })

    return (
        <div>
            <div style={Styles.row}>
                <div style={Styles.summaryCard}>
                    <h1 style={Styles.cardTitle}>Tasks Completed</h1>
                    <span style={{ color: "#5285EC", fontSize: "64px" }}>5</span>
                    <span style={{ fontSize: "24px" }}>/20</span>
                </div>
                <div style={Styles.summaryCard}>
                    <h1 style={Styles.cardTitle}>Latest Created Tasks</h1>
                    <ul style={Styles.list}>{latestTasks}</ul>
                </div>
                <div style={chartCard}>
                    <Chart options={chartOptions} series={series} type="pie" height="130px" width="130px" />
                </div>
            </div>
            <div className="row">
                <div className="col-md-5">Tasks</div>
                <div className="col-md-3"><input type="text" placeholder="search by task name" /></div>
                <div className="col-md-2"><button className="btn btn-primary">+New Task</button></div>

            </div>
            <div style={Styles.row}>
                <ul style={Styles.editableList.list}>{totalList}</ul>
            </div>

        </div>

    )
}




export default DashBoardComponent;
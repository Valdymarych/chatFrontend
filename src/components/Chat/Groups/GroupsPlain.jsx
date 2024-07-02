import React from "react"
import Preloader from "../../commons/Preloader/Preloader";
import RefreshButton from "../../commons/RefreshButton/RefreshButton";
import styles from "./Groups.module.css"
import addFile_svg from "../../../assest/addFile.svg"
import config from "../../../config";


let Group = (props) => {    

    let groupStyle=styles.group
    if (props.isCurrent){groupStyle=styles.group+" "+styles.group_current}

    let message;
    if (props.messages.length===0){message="..."}
    else {message=props.messages[0]}

    let messageHTML;
    if (message.type===config.messageTypes.text){messageHTML=message.payload}
    if (message.type===config.messageTypes.file){messageHTML=message.payload.name}

    return (
        <div className={groupStyle} onClick={()=>props.onClick()}>
            <div className={styles.group_name}>
                {props.name}
            </div>
            <div className={styles.group_message}>
                {messageHTML}
            </div>
        </div>
    )
}


let GroupsPlain = (props) => {
    let groups = props.groups.map((group)=>(<Group
        {...group}
        key={group._id}
        onClick={()=>props.changeCurrentGroup(group._id)}
        isCurrent={group._id===props.currentGroup}
        />))
    return (
        <div className={styles.groups}>
            {groups}
        </div>
    )
}

export default GroupsPlain;
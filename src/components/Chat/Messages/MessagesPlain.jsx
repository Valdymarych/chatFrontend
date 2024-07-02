import React from "react"
import Preloader from "../../commons/Preloader/Preloader";
import RefreshButton from "../../commons/RefreshButton/RefreshButton";
import styles from "./Messages.module.css"
import addFile_svg from "../../../assest/addFile.svg"
import file_svg from "../../../assest/file.svg"
import config from '../../../config.js'

let Message = (props) => {
    let headComponent;
    if (props.payload.uploadingStatus===config.isFetchingStatuses.ok){headComponent=<></>}
    if (props.payload.uploadingStatus===config.isFetchingStatuses.waiting){headComponent=<Preloader size={10}/>}
    if (props.payload.uploadingStatus===config.isFetchingStatuses.error){headComponent=<RefreshButton size={40} onRefresh={props.onRefresh}/>}

    let bodyComponent;
    if (props.type===config.messageTypes.text){bodyComponent=<div className={styles.message_text}>{props.payload}</div>}
    console.log(props.payload);
    if (props.type===config.messageTypes.file){bodyComponent=(

        <div className={styles.message_file} >
            <a href={props.payload.link} className={styles.message_file_link}>
                <img className={styles.message_file_img} src={file_svg} alt="file" />
                <div className={styles.message_file_title}>{props.payload.name}</div>
            </a>
        </div>

    )}

    let containerStyle = styles.message_container + (props.isOwner? "": " "+styles.message_container_others);
    let messageStyle = styles.message + (props.isOwner? "": " "+styles.message_others);
    
    return (
        <div className={containerStyle}>
            
            <div className={styles.head_component_container}>
                {headComponent}
            </div>
            <div className={messageStyle}>
                {bodyComponent}
            </div>
        </div>
    )
}

let ChatInput = (props) => {
    return (
        <div className={styles.input_bar_container} >
            <div className={styles.input_file_selector_container}>
                <label className={styles.input_file_selector_label} htmlFor="file_upload_input" >
                    <img className={styles.input_file_selector_image} src={addFile_svg} alt={config.altUploadFileInput} />
                </label>
                <input disabled={props.disabled} onChange={props.onFileChange} className={styles.input_file_selector_input} type="file" id="file_upload_input" />
            </div>
            <div className={styles.input_container}>
                <input disabled={props.disabled} placeholder={props.disabled?config.placeholderForDisabledInput:config.placeholderForInput} className={styles.input} value={props.value} onChange={props.onTextChange} onKeyDown={props.onKeyDown}/>
            </div>
        </div>
    )
}

let MessagesPlain = (props) => {
    let Messages = props.messages.map(
        (message)=>(
            <Message 
                type={message.type} 
                payload={message.payload} 
                key={message._id} 
                onRefresh={()=>props.repostMessage(message._id)}
                isOwner={message.owner._id===props.userId}
                owner={message.owner}
            />)
    )

    let onInputChange = (event) => props.changeTextInput(event.target.value)
    let onInputKeyDown = (event) => {if (event.key==="Enter"){props.postMessage(config.messageTypes.text)}}
    let onFileChange = (event) => {props.postMessage(config.messageTypes.file ,event.target.files[0])}

    let chatInput=(<ChatInput 
        disabled={!props.groupId}
        value={props.inputText} 
        onFileChange={onFileChange} 
        onTextChange={onInputChange} 
        onKeyDown={onInputKeyDown}/>)


    let messages;
    if (props.isFetching===config.isFetchingStatuses.ok){messages=Messages}
    if (props.isFetching===config.isFetchingStatuses.waiting){messages=<Preloader />}
    if (props.isFetching===config.isFetchingStatuses.error){messages=<RefreshButton size={160} onRefresh={()=>props.getMessages()}/>}

    return (
        <div className={styles.messages_section}>
            <div className={styles.messages}>
                {messages}
            </div>
            {chatInput}
        </div>
    )
}

export default MessagesPlain;
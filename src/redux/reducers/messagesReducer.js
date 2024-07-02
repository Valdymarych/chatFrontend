import { fileAPI, messagesAPI } from "../../api/api"
import config from "../../config"
import { setMessagesToGroup } from "./groupsReducer"



const ADD_MESSAGE="ADD_MESSAGE"
const UPDATE_MESSAGE="UPDATE_MESSAGE"
const SET_MESSAGES="SET_MESSAGES"
const CHANGE_IS_FETCHING_ALL_MESSAGES="CHANGE_IS_FETCHING_ALL_MESSAGES"
const CHANGE_IS_FETCHING_ONE_MESSAGE="CHANGE_IS_FETCHING_ONE_MESSAGE"
const CHANGE_TEXT_INPUT="CHANGE_TEXT_INPUT"
const CLEAR_MESSAGES="CLEAR_MESSAGES"


let initialState = {
    messages : [
        // {
        //     type: "text",
        //     payload: "Wow!",
        //     isFetching: "ok" | "waiting" | "error",
        //     owner: {name:"owner",_id:"sadasdasdfe"},
        //     _id: "woekwpoemgop23g4d23g4"
        // }
    ],
    input: "",
    isFetching: "ok", // "ok" | "waiting" | "error",
}

let messagesReducer = (state=initialState,action) => {
    switch (action.type) {
        case ADD_MESSAGE: return {...state,messages:[action.message,...state.messages]};
        case UPDATE_MESSAGE: return {...state,messages:state.messages.map((message)=>(message._id===message.messageId)? {...message, ...action.messageFields}:message)}
        case SET_MESSAGES: return {...state,messages:action.messages};
        case CHANGE_IS_FETCHING_ALL_MESSAGES: return {...state,isFetching:action.isFetching};
        case CHANGE_IS_FETCHING_ONE_MESSAGE: return {...state,messages:state.messages.map((message)=>(message._id===message.messageId)? {...message, isFetching:action.isFetching}:message)}
        case CHANGE_TEXT_INPUT: return {...state,input:action.input};
        case CLEAR_MESSAGES: return {...state,messages:[],input:"",isFetching:config.isFetchingStatuses.ok};

        default:
            return state;
    }
}


export const addMessage = (message) => ({type:ADD_MESSAGE,message})
export const updateMessage = (messageId, messageFields) => ({type:UPDATE_MESSAGE,messageId:messageId,messageFields:messageFields})
export const setMessages = (messages) => ({type:SET_MESSAGES,messages})
export const changeIsFetchingAllMessages = (isFetching) => ({type:CHANGE_IS_FETCHING_ALL_MESSAGES,isFetching})
export const changeIsFetchingOneMessage = (messageId,isFetching) => ({type:CHANGE_IS_FETCHING_ONE_MESSAGE,messageId,isFetching})
export const changeTextInput = (input) => ({type:CHANGE_TEXT_INPUT,input})
export const clearMessages = () => ({type:CLEAR_MESSAGES})


export const getMessages = () => async (dispatch,getState) => {
    let groupId = getState().groups.currentGroup
    dispatch(changeIsFetchingAllMessages(config.isFetchingStatuses.waiting))
    try {
        let messages = await messagesAPI.getMessages(groupId)
        if (messages.done) {
            messages=messages.group.messages.map(message=>({
                type: message.type,
                payload: message.payload,
                isFetching: config.isFetchingStatuses.ok,
                owner: {name:message.owner.name, _id:message.owner._id},
                _id: message._id
            }))
            dispatch(setMessages(messages))
            dispatch(setMessagesToGroup(groupId,messages))
            dispatch(changeIsFetchingAllMessages(config.isFetchingStatuses.ok))
        } else {
            dispatch(changeIsFetchingAllMessages(config.isFetchingStatuses.error))
        }
    } catch (err){
        console.log(err);
        dispatch(changeIsFetchingAllMessages(config.isFetchingStatuses.error))
    }
}

export const repostMessage = (_id) =>async (dispatch,getState) => {
    let message=getState.messages.messages.filter(message=>message._id===_id)[0];
    let type=message.type;
    let groupId = getState().groups.currentGroup
    dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.waiting))
    if (type===config.messageTypes.text){
        try {
            let data = await messagesAPI.postMessage(groupId,type,message.payload)
            if (data.done){
                dispatch(updateMessage(message._id,{_id:data.message._id,isFetching:config.isFetchingStatuses.ok}))
            } else {
                dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.error))    
            }
        } catch(err){
            dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.error))    
        }
    }
    if (type===config.messageTypes.file){
        let file=message.file;
        await postFile(file,(progress)=>{console.log(progress);},async(_id)=>{
            let messageDb = await messagesAPI.postMessage(groupId,type,message.payload)
            if (messageDb.done) {
                dispatch(updateMessage(message._id,{_id:messageDb.message._id,isFetching:config.isFetchingStatuses.ok}))
            } else {
                dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.error))
            }
        }, (err)=>dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.error)))
    }
}

export const postMessage = (type,file=undefined) => async (dispatch,getState) => { // {type:... }
    let message;
    let groupId = getState().groups.currentGroup
    if (!groupId){
        return
    }
    if (type==="text"){
        message={
            type,
            payload:getState().messages.input,
            _id:Math.random()+"",
            owner: {name:getState().user.name,_id:getState().user._id}
        }
        dispatch(changeTextInput(""))
        try {
            dispatch(addMessage(message))
            dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.waiting))
            let data = await messagesAPI.postMessage(groupId,type,message.payload)
            if (data.done){
                dispatch(updateMessage(message._id,{_id:data.message._id,isFetching:config.isFetchingStatuses.ok}))
            } else {
                dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.error))    
            }
        } catch(err){
            dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.error))    
        }
    }
    if (type==="file"){
        message={
            type,
            payload: {
                name: file.name
            },
            _id:Math.random()+"",
            owner: {name:getState().user.name,_id:getState().user._id},
            file:file
        }
        dispatch(addMessage(message))
        dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.waiting))
        await postFile(file,(progress)=>{console.log(progress);},async(file)=>{
            let messageDb = await messagesAPI.postMessage(groupId,type,{name:file.name,link:file.link,_id:file._id})
            if (messageDb.done) {
                dispatch(updateMessage(message._id,{_id:messageDb.message._id,isFetching:config.isFetchingStatuses.ok}))
            } else {
                dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.error))
            }
        },(err)=>dispatch(changeIsFetchingOneMessage(message._id,config.isFetchingStatuses.error))) // progress => щось з dispatch і AC

    }
}

export const postFile = async (file,onProgress,onPosted,onError) => {
    try {
        let fileDb=await fileAPI.upload(file,(progress)=>{onProgress(progress);}) // progress => щось з dispatch і AC
        if (fileDb.done){
            await onPosted(fileDb)
        } else {
            onError("server error")
        }
    } catch (err) {
        onError(err)
    }
   
}

export default messagesReducer
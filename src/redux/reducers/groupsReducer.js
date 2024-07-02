import { groupAPI } from "../../api/api"
import config from "../../config"
import { changeIsFetchingAllMessages, getMessages, setMessages } from "./messagesReducer"

const ADD_GROUP="ADD_GROUP"
const SET_GROUPS="SET_GROUPS"
const CHANGE_IS_FETCHING_ALL_GROUPS="CHANGE_IS_FETCHING_ALL_GROUPS"
const CHANGE_IS_FETCHING_ONE_GROUP="CHANGE_IS_FETCHING_ONE_GROUP"
const REMOVE_GROUP="REMOVE_GROUP"
const SET_MESSAGES_TO_GROUP="SET_MESSAGES_TO_GROUP"
const CHANGE_CURRENT_GROUP="CHANGE_CURRENT_GROUP"
const CLEAR_GROUPS="CLEAR_GROUPS"

let initialState = {
    // groups : [
    //     {
    //         name: "groupName",
    //         lastMessage: {
    //             type:"lastMessageType",
    //             payload:"lastMessagePayload",
    //             owner: {
    //                 name:"lastMessageOwnerName",
    //                 _id: "sdfsdfdsfdsf"
    //             }
    //         },
    //         isFetching: "ok",
    //         _id: "woekwpoemgop23g4d23g4"
    //     },
    // ],
    // currentGroup: "currentGroupId",
    // isFetching: "waiting", // "ok" | "waiting" | "error",
    groups: [],
    currentGroup: undefined,
    isFetching: config.isFetchingStatuses.waiting
}

let groupsReducer = (state=initialState,action) => {
    switch (action.type) {
        case ADD_GROUP: return {...state,groups:[action.group,...state.groups]};
        case SET_GROUPS: return {...state,groups:action.groups};
        case CHANGE_IS_FETCHING_ALL_GROUPS: return {...state,isFetching:action.isFetching};
        case CHANGE_IS_FETCHING_ONE_GROUP: return {...state,groups:state.groups.map((group)=>(group._id===action.groupId)? {...group, isFetching:action.isFetching}:group)}
        case REMOVE_GROUP: return {...state,groups:state.groups.filter(group=>group._id!==action.groupId)}
        case SET_MESSAGES_TO_GROUP: return {...state,groups:state.groups.map((group)=>(group._id===action.groupId)? {...group, messages:action.messages}:group)}
        case CHANGE_CURRENT_GROUP: return {...state,currentGroup:action.groupId}
        case CLEAR_GROUPS: return {...state,groups:[],isFetching:config.isFetchingStatuses.ok}
        default:
            return state;
    }
}


export const addGroup = (group) => ({type:ADD_GROUP,group})
export const setGroups = (groups) => ({type:SET_GROUPS,groups})
export const changeIsFetchingAllGroups = (isFetching) => ({type:CHANGE_IS_FETCHING_ALL_GROUPS,isFetching})
export const changeIsFetchingOneGroup = (groupId,isFetching) => ({type:CHANGE_IS_FETCHING_ONE_GROUP,groupId,isFetching})
export const removeGroup = (groupId) => ({type:REMOVE_GROUP,groupId})
export const setMessagesToGroup = (groupId,messages) => ({type:SET_MESSAGES_TO_GROUP,groupId,messages})
export const changeCurrentGroupId = (groupId) => ({type:CHANGE_CURRENT_GROUP,groupId})
export const clearGroups = () => ({type:CLEAR_GROUPS})


export const groupsMapper=(groups)=>{
    return groups.map(group=>({
        _id:group._id,
        name:group.name,
        isFetching: config.isFetchingStatuses.ok,
        messages: group.messages
    }))
}

export const changeCurrentGroup = (groupId) => async (dispatch,getState) => {   // повністю відповідає за приєднання до групи
    let currentGroup = getState().groups.groups.filter((group)=>group._id===groupId)[0]
    dispatch(changeCurrentGroupId(groupId))
    if (currentGroup.isFetching===config.isFetchingStatuses.done){
        dispatch(setMessages(currentGroup.messages));
    }
    else {
        dispatch(changeIsFetchingOneGroup(groupId,config.isFetchingStatuses.waiting))
        dispatch(changeIsFetchingAllMessages(config.isFetchingStatuses.waiting))
        dispatch(getMessages());
        dispatch(changeIsFetchingAllMessages(config.isFetchingStatuses.ok))
        dispatch(changeIsFetchingOneGroup(groupId,config.isFetchingStatuses.done))
    }
}


export const joinGroup = (joinLink) => async (dispatch) => {   // повністю відповідає за приєднання до групи
    dispatch(addGroup(config.joiningGroup))
    changeCurrentGroup(config.joiningGroup._id)
    dispatch(changeIsFetchingAllMessages(config.isFetchingStatuses.waiting))
    try {
        let joiningData = await groupAPI.joinGroup(joinLink)
        if (joiningData.done) {
            dispatch(setMessages(joiningData.group.messages))
            dispatch(addGroup(joiningData.group))
            dispatch(changeCurrentGroup(joiningData.group._id))
        } else {
            // перекинути на ту групу що було
        }
    } catch (err){
        console.log(err);
        dispatch(changeCurrentGroup(""))
    }
    dispatch(changeIsFetchingAllMessages(config.isFetchingStatuses.ok))
    dispatch(removeGroup(config.joiningGroup._id))
}

export const getGroups = () => async (dispatch) => {
    dispatch(changeIsFetchingAllGroups(config.isFetchingStatuses.waiting))
    try {
        let groups = await groupAPI.getGroups();
        if (groups.done) {
            groups=groupsMapper(groups.groups)
            dispatch(setGroups(groups))
        } else {
            dispatch(changeIsFetchingAllGroups(config.isFetchingStatuses.error))
        }
    } catch (err){
        dispatch(changeIsFetchingAllGroups(config.isFetchingStatuses.error))
    }
}

export const deleteGroup = (group) => async (dispatch) => {
    try {  
        if (!group.owner){
            removeGroup(group._id)
            return
        }
        if (window.confirm(config.groupDeletingQuestion)){
            let deletedGroup = await groupAPI.deleteGroup(group._id)
            if (deletedGroup.done){
                removeGroup(group._id)
            } else {
                alert(config.groupDeletingFailMessage)
            }
        }
    } catch (err){
        alert(config.groupDeletingFailMessage)
    }
}


export default groupsReducer
import { connect } from "react-redux"
import MessagesPlain from "./MessagesPlain"
import { changeTextInput, getMessages, postMessage, repostMessage } from "../../../redux/reducers/messagesReducer"
import React from "react"

let mapStateToProps = (state) => ({
    messages : state.messages.messages,
    inputText : state.messages.input,
    isFetching : state.messages.isFetching,
    groupId: state.groups.currentGroup,
    userId: state.user._id
})

let mapDispatchToProps = {
    changeTextInput,
    getMessages,
    postMessage,
    repostMessage
}




let Messages = connect(mapStateToProps,mapDispatchToProps)(MessagesPlain)


export default Messages;
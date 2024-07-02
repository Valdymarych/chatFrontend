import { connect } from "react-redux"
import GroupsPlain from "./GroupsPlain"
import React from "react"
import { changeCurrentGroup } from "../../../redux/reducers/groupsReducer"

let mapStateToProps = (state) => ({
    groups: state.groups.groups,
    currentGroup: state.groups.currentGroup,
})

let mapDispatchToProps = {
    changeCurrentGroup
}

class GroupsContainer extends React.Component {
    componentDidMount() {
        //this.props.getMessages()
    }
    render() {
        return (
            <GroupsPlain {...this.props}/>
        )
    }
}


let Groups = connect(mapStateToProps,mapDispatchToProps)(GroupsContainer)


export default Groups;
import { connect } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import styles from './App.module.css';
import Chat from './Chat/Chat';
import CommonPage from './Pages/CommonPage/CommonPage';

import {auth} from '../redux/reducers/userReducer'
import React from 'react';
import config from '../config';
import { Login, Registration } from './Registration/Forms';

function AppPlain(props) {
    let routes;
    if (props.isAuthing===config.isAuthingStatuses.out || props.isAuthing===config.isAuthingStatuses.waiting || props.isAuthing===config.isAuthingStatuses.error) {
        routes = (
            <Routes>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="*" element={<Navigate to="/login"/>}/>
            </Routes>
        )
    }
    if (props.isAuthing===config.isAuthingStatuses.in) {
        routes = (
            <Routes>
                <Route path="/" element={<Chat/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        )
    }

    return (
        <div className={styles.App}>
            <CommonPage>
                {routes}
            </CommonPage>
        </div>
    );
}

class AppClass extends React.Component {
    componentDidMount() {
        this.props.auth()
    }

    render (){
        return (<AppPlain {...this.props}/>)
    }
}

let mapStateToProps = (state) => ({
    isAuthing:state.user.isAuthing
})

let mapDispatchToProps = {
    auth
}

const App = connect(mapStateToProps,mapDispatchToProps)(AppClass)

export default App;

import styles from "./Navbar.module.css"
import {NavLink} from "react-router-dom"
import { connect } from "react-redux"
import { logout } from "../../../redux/reducers/userReducer"
import config from "../../../config"

let NavbarButton = (props) => {
    return (
        <div className={styles.navbar_button_container}>
            <NavLink to={props.to}>
                <button className={styles.navbar_button} onClick={()=>props.onClick()}>{props.text}</button>
            </NavLink>
        </div>
    )
}

let NavbarPlain = (props) => {
    return (
        <div className={styles.navbar}>
            <div className={styles.navbar_title}>
                CHAT
            </div>
            <div className={styles.navbar_buttons}>

                {
                    props.isAuthing===config.isAuthingStatuses.in?
                    <NavbarButton to="/login" onClick={()=>props.logout()} text={config.navbarButtonsText.logout}/>:
                    <>
                        <NavbarButton to="/login" onClick={()=>{}} text={config.navbarButtonsText.login}/>
                        <NavbarButton to="/registration" onClick={()=>{}} text={config.navbarButtonsText.signin}/>
                    </>

                }


            </div>
        </div>

    )
}
let mapStateToProps = (state) => ({
    isAuthing : state.user.isAuthing
})

let mapDispatchToProps = {
    logout: logout
}

let Navbar = connect(mapStateToProps,mapDispatchToProps)(NavbarPlain)


export default Navbar
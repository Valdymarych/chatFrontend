import { connect } from "react-redux"
import { setFormData, login, register } from "../../redux/reducers/userReducer"
import config from "../../config"
import FormPage from "./FormPage"


let mapStateToPropsRegistration = (state) => ({
    form: state.user.registrationForm,
    formName: "registrationForm",
    isAuthing : state.user.isAuthing
})

let mapStateToPropsLogin = (state) => ({
    form: state.user.loginForm,
    formName: "loginForm",
    isAuthing : state.user.isAuthing
})


let mapDispatchToPropsRegistration = ({
    setFormData,
    onSubmit: register
})

let mapDispatchToPropsLogin = ({
    setFormData,
    onSubmit: login
})

let RegistrationPlain = (props) => <FormPage submit_button_text = {config.submitRegistrationButtonText} {...props}/>
let LoginPlain = (props) => <FormPage submit_button_text = {config.submitLoginButtonText} {...props}/>


export const Registration = connect(mapStateToPropsRegistration,mapDispatchToPropsRegistration)(RegistrationPlain)
export const Login = connect(mapStateToPropsLogin,mapDispatchToPropsLogin)(LoginPlain)
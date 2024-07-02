
import { userAPI } from "../../api/api";
import config from "../../config";
import { clearGroups, groupsMapper, setGroups } from "./groupsReducer";
import { clearMessages } from "./messagesReducer";

const SET_FORM_DATA = "SET_FORM_DATA"
const SET_FORM_STATUS= "SET_FORM_STATUS"
const CHANGE_IS_AUTHING = "CHANGE_IS_AUTHING"
const SET_USER = "SET_USER"

let initialState = {
    registrationForm: {
        email: {status:config.formFieldsStatuses.ok, placeholder:"Введіть пошту",data:""},
        password: {status:config.formFieldsStatuses.ok,placeholder:"Введіть пароль",data:""},
        name: {status:config.formFieldsStatuses.ok,placeholder:"Як вас називати?",data:""},
    },
    loginForm: {
        email: {status:config.formFieldsStatuses.ok,placeholder:"Введіть пошту",data:""},
        password: {status:config.formFieldsStatuses.ok,placeholder:"Введіть пароль",data:""},
    },
    name: "!(user.name)",
    _id: "!(user.id)",

    isAuthing: config.isAuthingStatuses.out // "out" | "waiting" | "error" | "in",
}

let userReducer = (state=initialState,action) => {
    switch (action.type) {
        case SET_FORM_DATA:
            state={...state,registrationForm:{...state.registrationForm},loginForm:{...state.loginForm}}
            state[action.formName][action.fieldName].data=action.value
            state[action.formName][action.fieldName].status=config.formFieldsStatuses.ok
            return state;
        case SET_FORM_STATUS:
            state={...state,registrationForm:{...state.registrationForm},loginForm:{...state.loginForm}}
            state[action.formName][action.fieldName].status=action.status
            return state;
        case CHANGE_IS_AUTHING: return {...state,isAuthing: action.isAuthing}
        case SET_USER: return {...state,name: action.name,_id:action._id}
        default:
            return state;
    }
}

export const setFormData = (formName,fieldName,value) => ({type:SET_FORM_DATA,value,formName,fieldName})
export const setFormStatus = (formName,fieldName,status) => ({type:SET_FORM_STATUS,status,formName,fieldName})
export const changeIsAuthing = (isAuthing) => ({type:CHANGE_IS_AUTHING,isAuthing})
export const setUser = (name,_id) => ({type:SET_USER,name,_id})

export const register = () => async (dispatch,getState) => {
    let form=getState().user.registrationForm
    let email=form.email.data;
    let password=form.password.data;
    let name=form.name.data;
    await authHandler(dispatch,async () => await userAPI.register(email,password,name),(err)=>registerErrorHandler(err,dispatch))
}

export const login = () => async (dispatch,getState) => {
    let form=getState().user.loginForm
    let email=form.email.data;
    let password=form.password.data;
    await authHandler(dispatch,async () => await userAPI.login(email,password),(err)=>loginErrorHandler(err,dispatch))

}

export const auth = () => async (dispatch) => {
    await authHandler(dispatch,async  ()=>await userAPI.auth(),(err)=>{dispatch(changeIsAuthing(config.isAuthingStatuses.out))})
}
export const logout = () => (dispatch) => {
    dispatch(changeIsAuthing(config.isAuthingStatuses.out))
    dispatch(setUser(initialState.name,initialState._id))
    dispatch(clearGroups())
    dispatch(clearMessages())
    userAPI.logout()
}



const authHandler = async (dispatch,getUser,onError)=>{
    dispatch(changeIsAuthing(config.isAuthingStatuses.waiting))
    try {
        let user=await getUser();
        dispatch(changeIsAuthing(config.isAuthingStatuses.in))
        dispatch(setUser(user.name,user._id))
        dispatch(setGroups(groupsMapper(user.groups)))
    } catch (err) {
        onError(err)
    }
}

const registerErrorHandler = (err,dispatch)=>{
    let response = err.response;
    if (response){
        if (response.status===400){
            let errors = response.data.errors.errors
            for (let i=0; i<errors.length;i++) {
                let error=errors[i]
                if (error.path==="email"){ dispatch(setFormStatus("registrationForm","email",config.formFieldsStatuses.error)) }
                if (error.path==="password"){ dispatch(setFormStatus("registrationForm","password",config.formFieldsStatuses.error)) }
                if (error.path==="name"){ dispatch(setFormStatus("registrationForm","name",config.formFieldsStatuses.error)) }

            }
        }
        if (response.status===409){
            dispatch(setFormStatus("registrationForm","email",config.formFieldsStatuses.error))
        }
    }
    dispatch(changeIsAuthing(config.isAuthingStatuses.error))
}

const loginErrorHandler = (err,dispatch)=>{
    console.log(err);
    let response = err.response;
    if (response){
        if (response.status===400){
            if (response.data.errors){
                let errors = response.data.errors.errors
                for (let i=0; i<errors.length;i++) {
                    let error=errors[i]
                    console.log(error);
                    if (error.path==="email"){ dispatch(setFormStatus("loginForm","email",config.formFieldsStatuses.error)) }
                    if (error.path==="password"){ dispatch(setFormStatus("loginForm","password",config.formFieldsStatuses.error)) }
                }
            } else {
                dispatch(setFormStatus("loginForm","password",config.formFieldsStatuses.error))
            }
        }
        if (response.status===404) {
            dispatch(setFormStatus("loginForm","email",config.formFieldsStatuses.error))
        }
    }
    dispatch(changeIsAuthing(config.isAuthingStatuses.error));
}
export default userReducer
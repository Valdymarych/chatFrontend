import styles from "./FormPage.module.css"
import Preloader from "../commons/Preloader/Preloader"
import config from "../../config"

let FormInput = (props) => {

    let style = styles.form_input;
    if (props.isError){
        style=styles.form_input+" "+styles.form_input_error
    }

    let inputHTML = <input 
        className={style} 
        placeholder={props.placeholder} 
        value={props.value} 
        onChange={(event)=>{props.onChange(event.target.value)}} />

    return (
        <div className={styles.form_input_container}>
            {inputHTML}
        </div>
    )
}

let SubmitButton = (props) => {
    return (
        <div className={styles.submit_button_container}>
            {
            props.isAuthing?
                <button disabled={true} className={styles.submit_button} onClick={()=>props.onClick()}>
                    <Preloader size={15}/>
                </button>  
                    :
                <button className={styles.submit_button} onClick={()=>props.onClick()}>
                    {props.text}
                </button>           
            }
        </div>
    )
}

let FormPage = (props) =>{
    let inputs=[]
    for (let fieldName in props.form){
        inputs.push((
        <FormInput 
            isError={props.form[fieldName].status===config.formFieldsStatuses.error} 
            placeholder={props.form[fieldName].placeholder}
            value={props.form[fieldName].data} 
            onChange={(v)=>props.setFormData(props.formName,fieldName,v)}
            key={fieldName}/>
        ))
    }

    let submitButton = (
        <SubmitButton 
            isAuthing={props.isAuthing===config.isAuthingStatuses.waiting} 
            text={props.submit_button_text} 
            onClick={()=>props.onSubmit()}/>
    )

    return (
        <div className={styles.auth}>
            <div className={styles.auth_form}>
                {inputs}
                {submitButton}
            </div>
        </div>
    )
}


export default FormPage
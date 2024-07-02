import styles from "./RefreshButton.module.css"
import arrow_svg from "../../../assest/arrow.svg"
let RefreshButton = (props) => {
    return (
        <div className={styles.refresh_button_container}>
            <button className={styles.refresh_button} onClick={()=>props.onRefresh()}>
                <img className={styles.arrow_svg} src={arrow_svg} width={`${props.size}px`} height={`${props.size}px`} alt={"refresh"}/>
            </button>
        </div>

    )
}
export default RefreshButton
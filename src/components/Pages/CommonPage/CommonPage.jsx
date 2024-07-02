import Navbar from "../../commons/Navbar/Navbar"
import styles from "./CommonPage.module.css"

let CommonPage = (props) => {
    return (
        <div className={styles.common_page}>
            <div className={styles.common_page_navbar}>            
                <Navbar/>
            </div>
            <div className={styles.common_page_content}>
                {props.children}
            </div>
        </div>
    )
}
export default CommonPage
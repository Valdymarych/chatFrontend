import Groups from "./Groups/Groups";
import Messages from "./Messages/Messages";
import styles from "./Chat.module.css"
let Chat = (props) => {
    return (
        <div className={styles.chat}>
            <Groups/>
            <Messages />
        </div>

    )
}

export default Chat;
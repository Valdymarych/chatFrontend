import styles from "./Preloader.module.css"
let Preloader = (props) => {
    let size=60;
    let duration=500;
    if (props.size){
        size=props.size
    }
    let loaders = []
    let style;
    for (let i=0;i<3;i++){
        style={
            width:size,
            height:size,
            margin:2/3*size,
            animationDelay: `${i/3*duration}ms`,
            animationDuration: `${duration}ms`
        }
        loaders.push(<div className={styles.loader} style={style} key={i}></div>)
    }
    return (
        <div className={styles.loaders_container}>
            {loaders}
        </div>

    )
}
export default Preloader
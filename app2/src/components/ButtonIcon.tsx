interface IButtonIconProp {
    icon?:string;
}

export default function ButtonIcon(props:IButtonIconProp) {
    return (
        <button  className="button-icon material-icons">{props.icon}</button>
    )
} 
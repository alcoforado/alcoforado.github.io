
import ButtonIcon from './ButtonIcon';


export default function AppBar(props:any) {
    return (
    <div className="nav-spacer">
    <nav className="app-bar">
        <span className="panel-left">
            <ButtonIcon icon="menu"></ButtonIcon>
         </span>
          <span className="panel-right">
         </span>
    </nav>
    </div>
    )
} 
import { MouseEventHandler, useRef, useState } from "react"

export default function Ripple(props:any) {
    const root = useRef<HTMLDivElement>(null)
    var [X,setX]= useState(0);
    var [Y,setY]= useState(0);
    var [width,setWidth] = useState(0);
    var [height,setHeight] = useState(0);

    var startRipple:MouseEventHandler<HTMLDivElement> = (ev) => {
        const rootRect = root.current?.getBoundingClientRect();
        if (rootRect)
        {
            setX(ev.clientX - rootRect.left);
            setY(ev.clientY - rootRect.top); 
        }
        var size=Math.max(rootRect?.width ?? 0,rootRect?.width ?? 0)
        setWidth(size);
        setHeight(size);
       
        setTimeout(()=>{
            
            setWidth(0);
            setHeight(0);
        },2000)

    }


    var style = {
        top:X,
        left:Y,
        width,
        height
    }

    return (
        <div ref={root} className="ripple" onClick={startRipple}>
            {props.children}
            <s style={style} className="circle"></s>
        </div>
    )
} 


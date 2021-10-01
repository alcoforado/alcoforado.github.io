import { MouseEventHandler, useRef, useState } from "react"

export default function Ripple(props:any) {
    const root = useRef<HTMLDivElement>(null)
    var [X,setX]= useState<number>(0);
    var [Y,setY]= useState<number>(0);
    var [width,setWidth] = useState<number|null>(0);
    var [height,setHeight] = useState<number|null>(0);
    var [isContracting,setIsContracting] =  useState(false);
    var startRipple:MouseEventHandler<HTMLDivElement> = (ev) => {
        const rootRect = root.current?.getBoundingClientRect();
        
        if (rootRect)
        {
            setX(ev.clientX - rootRect.left);
            setY(ev.clientY - rootRect.top); 
        }
        var size=2*Math.max(rootRect?.width ?? 0,rootRect?.height ?? 0)
        setWidth(size);
        setHeight(size);
        setIsContracting(false);
        setTimeout(()=>{
            setIsContracting(true);
            setWidth(null);
            setHeight(null);
        }, 2000)

    }


    

    var style = {
        top:Y,
        left:X,
        width: width ?? "",
        height: height ?? "",
        transform: isContracting ? "" : "transform width 2s, height 2s"
    }

    return (
        <div ref={root} className="ripple" onClick={startRipple}>
            {props.children}
            <s style={style} className="circle"></s>
        </div>
    )
} 


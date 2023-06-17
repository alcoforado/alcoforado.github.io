import { Typography } from "@mui/material";
import { MutableRefObject, useEffect , useRef, useState} from "react";
import MGL from "../logic/mgl/mgl";
interface PlotProp {
    title:string;
}

export default function Plot3D(prop:PlotProp){
    document.title=prop.title;
    let canvas=useRef<HTMLCanvasElement>(null)
    var [_mgl,setMGL] = useState<MGL>()
    useEffect(()=>{
        var mgl=new MGL(canvas.current);
        let gl=mgl.gl();
        gl.clearColor(0,0,0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    },[])
    return <>
    <div>
        <Typography variant="h5">Plot 3D</Typography>
    </div>
    <div>
        <canvas ref={canvas} width="600px" height="600px"></canvas>
    </div>
    </>

    


}
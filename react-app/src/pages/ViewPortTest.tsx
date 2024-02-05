import { Typography } from "@mui/material";
import { MutableRefObject, useEffect , useRef, useState} from "react";

import MGL from "../logic/mgl/mgl";
import { Shader2d } from "../logic/shaders/shader2d";
import { CyclicColorRender } from "../logic/renders/cyclicColorRender";
import {Rectangle} from "../logic/topology/rectangle";
interface PlotProp {
    title:string;
}

export default function ViewPortTest(prop:PlotProp){
    document.title=prop.title;
    let canvas=useRef<HTMLCanvasElement>(null)
    var [_mgl,setMGL] = useState<MGL>()
    useEffect(()=>{
        console.log("hello")
        if (_mgl)
            return;
       var mgl=new MGL(canvas.current);
        setMGL(mgl);
        let gl=mgl.gl();
        gl.clearColor(1,0,0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var sh=new Shader2d(mgl);
        //sh.addShape(new Rectangle([-1,1,0],[-1,-1,0],[1,-1,0],[1,1,0]),new CyclicColorRender([[1,1,1]]))

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
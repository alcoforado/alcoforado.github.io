import { Typography } from "@mui/material";
import { MutableRefObject, useEffect , useRef, useState} from "react";

import MGL from "../logic/mgl/mgl";
import { Shader2d } from "../logic/shaders/shader2d";
import { CyclicColorRender } from "../logic/renders/cyclicColorRender";
import {Rectangle} from "../logic/shapes/rectangle";
interface PlotProp {
    title:string;
}

export default function ViewPortTest(prop:PlotProp){
    document.title=prop.title;
    let canvas=useRef<HTMLCanvasElement>(null)
    let [_mgl,setMGL] = useState<MGL>()
    useEffect(()=>{
        console.log("hello")
        if (_mgl)
            return;
       var mgl=new MGL(canvas.current);
        setMGL(mgl);
        let gl=mgl.gl();
        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(1.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var sh=new Shader2d(mgl);
        //sh.addShape(new Rectangle([0.25,0.25],0.5,0.5),new CyclicColorRender([[1,0,0],[0,1,0],[0,0,1]]));
      
        
        mgl.waitInitialization(()=>{
            sh.addShape(new Rectangle([0,0],1,1),new CyclicColorRender([[1,0,0],[0,1,0],[0,0,1],[1,1,0]]));
            sh.draw()
            
        });
    },[_mgl])
    return <>
    <div>
        <Typography variant="h5">Plot 3D</Typography>
    </div>
    <div >
        <canvas ref={canvas}  style={{display:"block",margin:"0 auto",backgroundColor:"black"}} width="600px" height="600px"></canvas>
    </div>
    </>

    


}
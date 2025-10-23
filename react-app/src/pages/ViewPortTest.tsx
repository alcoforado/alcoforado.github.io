import { Typography } from "@mui/material";
import {  useEffect , useRef, useState} from "react";
import {BitmapFont} from '../logic/shapes/text'
import MGL from "../logic/mgl/mgl";
import {Rectangle} from "../logic/topology/2d/rectangle";
import { ShaderType } from "../logic/shaders/shader-factory";
import {Shape2DVertexColor} from '../logic/shapes/shape2dVertextColor'
interface PlotProp {
    title:string;
}

export default function ViewPortTest(prop:PlotProp){
    document.title=prop.title;
    let canvas=useRef<HTMLCanvasElement>(null)
    let [_mgl,setMGL] = useState<MGL>()
    useEffect(()=>{
        if (_mgl)
            return;
       var mgl=new MGL(canvas.current);
        setMGL(mgl);
        let gl=mgl.gl();
        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(1.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        mgl.loadShader(ShaderType.VERTICE_COLOR_2D)
        mgl.loadShader(ShaderType.TEXTURE_2D);
        //sh.addShape(new Rectangle([0.25,0.25],0.5,0.5),new CyclicColorRender([[1,0,0],[0,1,0],[0,0,1]]));
       
        new Shape2DVertexColor(mgl,new Rectangle([0,0],1,1),
        [[0,0,0,1],[0,1,0,1],[0,0,1,1],[1,1,0,1]]);
       // new Shape2DVertexColor(mgl,new Rectangle([0,0],-1,-1),
       // [[0,0,0,1],[0,1,0,1],[0,0,1,1],[1,1,0,1]]);
        let font=new BitmapFont(mgl,"./bitmap-fonts/sans-serif-72-white");
        
        mgl.waitInitialization(()=>{
            mgl.draw();
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
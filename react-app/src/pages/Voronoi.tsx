import { Typography } from "@mui/material";
import { MutableRefObject, useEffect , useRef, useState} from "react";
import MGL from "../logic/mgl/mgl";
interface VoronoiProp {
    title:string;
}

export default function Voronoi(prop:VoronoiProp){
    document.title=prop.title;
    let canvas=useRef<HTMLCanvasElement>(null)
    var [_mgl,setMGL] = useState<MGL>()
    useEffect(()=>{
        var mgl=new MGL(canvas.current);
        let gl=mgl.gl();
        gl.clearColor(0.0,0,0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    },[])
    return <>
    <div>
        <Typography variant="h5">Voronoi Diagram</Typography>
        <Typography>Given a set of n points distributed in a map, plot a neighborhood around each  point that is closest to it. </Typography>
        <Typography>We will solve the problem using Fortunas Alghorithm</Typography> 
    </div>
    <div>
        <canvas ref={canvas} width="600px" height="600px"></canvas>
    </div>
    </>

    


}
import MGL from "../mgl/mgl";
import { ITopology } from './itopology';
import { CyclicColorRender } from "../renders/cyclicColorRender";
import {MGLProgram} from '../mgl/mglProgram'
import  DrawTree  from "./drawTree";
import {BufferLayout} from '../mgl/bufferLayout'
export class Shader2d {
    private program:MGLProgram;
    private bufferLayout:BufferLayout;
    //private drawTree:DrawTree<CyclicColorRender>;
    constructor(private glContext:MGL)
    {  
        //create program
        this.bufferLayout=new BufferLayout();
        this.program=new MGLProgram(glContext,"/glsl/vshader2d.glsl","/glsl/fshader2d.glsl");
        this.program.config((config)=>{
            config.addVertexAttribute("position",2);
            config.addVertexAttribute("vColor",4);
            
        })
        

        
    }
    
   

    draw()
    {

        //this.drawTree.Serialize();
    }

};
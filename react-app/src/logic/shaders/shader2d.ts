import MGL from "../mgl/mgl";
import { ITopology } from '../topology/itopology';
import { CyclicColorRender } from "../renders/cyclicColorRender";
import {MGLProgram} from '../mgl/mglProgram'
import  DrawTree  from "./drawTree";
import {BufferLayout} from '../mgl/bufferLayout'
export class Shader2d {
    private program:MGLProgram;
    private bufferLayout:BufferLayout;
    private drawTree:DrawTree<CyclicColorRender>;
    constructor(private glContext:MGL)
    {  
        //create program
        this.bufferLayout=new BufferLayout();
        this.program=new MGLProgram(glContext,"/glsl/vshader2d.glsl","/glsl/fshader2d.glsl");
        this.program.BindingManager.VertexAttributes.add("position",2);
        this.program.BindingManager.VertexAttributes.add("vColor",4);
        this.drawTree=new DrawTree<CyclicColorRender>(this.glContext,this.program)
        
    }
    
    addShape(top:ITopology,render:CyclicColorRender):void
    {
        this.drawTree.addObject(top,render);
    }

    draw()
    {

        //this.drawTree.Serialize();
    }

};
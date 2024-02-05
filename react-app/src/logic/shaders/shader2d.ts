import MGL from "../mgl/mgl";
import { ITopology } from '../topology/itopology';
import { CyclicColorRender } from "../renders/cyclicColorRender";
import { BufferLayout, LayoutFieldType } from "./bufferLayout";
import  DrawTree  from "./drawTree";
export class Shader2d {
    private program:WebGLProgram|null=null;
    private bufferLayout:BufferLayout;
    private drawTree:DrawTree<CyclicColorRender>;
    constructor(private glContext:MGL)
    {
        //create program
        this.bufferLayout=new BufferLayout();
        this.bufferLayout
           .addMember("position",LayoutFieldType.VEC3)
           .addMember("vColor",LayoutFieldType.VEC3)
        this.drawTree=new DrawTree<CyclicColorRender>(glContext,this.bufferLayout)
        
        glContext.createProgram( "~/glsl/shader2d.vert","~/glsl/shader2d.frag")
        .then((pg)=>this.program=pg);
        
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
import MGL from "../mgl";
import { ITopology } from '../topology/ITopology';
import { CyclicColorRender } from "../renders/cyclicColorRender";
import { BufferLayout, LayoutFieldType } from "./bufferLayout";
import { BufferSerialization } from "./bufferSerialization";
export class Shader2d {
    private program:WebGLProgram|null=null;
    private bufferLayout:BufferLayout;
    private bufferSerialization:BufferSerialization<ITopology,CyclicColorRender>;
    constructor(private glContext:MGL)
    {
        //create program
        glContext.createProgram( new URL("~/glsl/shader2d.vert"),new URL("~/glsl/shader2d.frag"))
        .then((pg)=>this.program=pg);
        this.bufferLayout=new BufferLayout();
        this.bufferLayout
            .addMember("position",LayoutFieldType.VEC3)
            .addMember("vColor",LayoutFieldType.VEC3)
        this.bufferSerialization=new BufferSerialization<ITopology,CyclicColorRender>(this.bufferLayout)
        
    }

    addObject(top:ITopology,render:CyclicColorRender):void
    {
        this.bufferSerialization.addObject(top,render);
    }

    init()
    {
        
    }

    

};
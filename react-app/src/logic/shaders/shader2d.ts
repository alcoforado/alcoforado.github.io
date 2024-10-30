import MGL from "../mgl/mgl";
import { ITopology } from './itopology';
import { CyclicColorRender } from '../renders/cyclicColorRender';
import {UniformType} from '../mgl/bindingManager'
import {MGLProgram} from '../mgl/mglProgram'
import  DrawTree  from "./drawTree";
import { IShape } from "./ishape";
export class Shader2d {
    private program:MGLProgram;
    private drawTree:DrawTree;
    //private drawTree:DrawTree<CyclicColorRender>;
    constructor(private glContext:MGL)
    {  
        //create program
        
        this.program=new MGLProgram(glContext,"/glsl/vshader2d.glsl","/glsl/fshader2d.glsl");
        this.program.config((config)=>{
            config.addVertexAttribute("position",2);
            config.addVertexAttribute("vColor",4);
            config.addUniformInt("pointSize");
        })
        this.drawTree=new DrawTree(glContext,this.program)
    }
    
    addShape(sh:IShape) {
        this.drawTree.addObject(sh);
    }
   

    draw()
    {
        this.drawTree.draw();
        //this.drawTree.Serialize();
    }

};
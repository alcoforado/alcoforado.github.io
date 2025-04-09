import MGL from "../mgl/mgl";
import {MGLProgram} from '../mgl/mglProgram'
import  DrawTree  from "./drawTree";
import {IShader} from './ishader'
export class Shader2dTexture extends IShader {
    //private drawTree:DrawTree<CyclicColorRender>;
    constructor(private glContext:MGL)
    {  
        //create program
        
        let program=new MGLProgram(glContext,"/glsl/vshader2d.glsl","/glsl/fshader2d.glsl");
        program.config((config)=>{
            config.addVertexAttribute("position",2);
            config.addVertexAttribute("vColor",4);
            config.addUniformInt("pointSize");
        })
        let drawTree=new DrawTree(glContext,program);
        super(glContext,drawTree,program);
    }
    
   

};
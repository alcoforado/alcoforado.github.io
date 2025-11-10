import MGL from "../mgl/mgl";
import {MGLProgram} from '../mgl/mglProgram'
import  DrawTree  from "./drawTree";
import {IShader} from './ishader'
export class Shader2dTexture extends IShader {
    //private drawTree:DrawTree<CyclicColorRender>;
    constructor(private glContext:MGL)
    {  
        let program=new MGLProgram(glContext,"/glsl/vtexturendc.glsl","/glsl/ftexturendc.glsl");
        program.config((config)=>{
            config.addVertexAttribute("position",2);
            config.addVertexAttribute("texCoord",2);
            config.addUniformInt("sampler");
            
        })
        let drawTree=new DrawTree(glContext,program);
        super(glContext,drawTree,program);
    }
    
   

};